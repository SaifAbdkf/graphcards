import { Request, Response } from "express";
import mongoose from "mongoose";
import { Card } from "../models/CardModel";
import { DeckInfo } from "../models/DeckModel";
import { Link } from "../models/LinkModel";
import {
  failureResponseObject,
  successResponseObject,
  GraphdeckChangePayloadSchema,
} from "../utils/utils";

export async function getGraphdeck(
  request: Request,
  response: Response
): Promise<Response> {
  const { deckId } = request.params;

  try {
    const deckInfo = await DeckInfo.findById(deckId);
    if (!deckInfo) {
      return response
        .status(404)
        .json(failureResponseObject("graphdeck not found"));
    }

    const deckCards = await Card.find({ deckId: deckId });
    const deckLinks = await Link.find({ deckId: deckId });

    const deck = {
      _id: deckInfo._id,
      name: deckInfo.name,
      description: deckInfo.description,
      cards: deckCards,
      links: deckLinks,
    };

    return response.status(200).json(successResponseObject(deck));
  } catch (error) {
    return response
      .status(500)
      .json(
        failureResponseObject(
          "error getting the deck and its cards and links",
          error
        )
      );
  }
}

export async function updateGraphdeck(
  request: Request,
  response: Response
): Promise<Response> {
  const validationResult = GraphdeckChangePayloadSchema.safeParse(request.body);

  if (!validationResult.success) {
    console.log(validationResult.error);

    return response
      .status(400)
      .json(
        failureResponseObject(
          "Invalid graphdeck update payload",
          validationResult.error
        )
      );
  }

  const { deckId, cards, links } = validationResult.data;

  // Validate deck exists
  const deckInfo = await DeckInfo.findById(deckId);
  if (!deckInfo) {
    return response.status(404).json(failureResponseObject("Deck not found"));
  }

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    // Process cards
    for (const cardPayload of cards) {
      switch (cardPayload.dbAction) {
        case "create":
          const newCard = await Card.create(
            [
              {
                _id: cardPayload.data._id,
                deckId: deckId,
                x: cardPayload.data.x,
                y: cardPayload.data.y,
                front: cardPayload.data.front,
                back: cardPayload.data.back,
              },
            ],
            { session }
          );
          console.log("Created card with id:", newCard[0]._id);
          break;

        case "update":
          const { _id: updateCardId, ...cardUpdateData } = cardPayload.data;
          const updatedCard = await Card.findOneAndUpdate(
            { _id: updateCardId },
            cardUpdateData,
            { new: true, session }
          );
          if (!updatedCard) {
            throw new Error(`Card with id ${updateCardId} not found`);
          }
          console.log("Updated card with id:", updateCardId);
          break;

        case "delete":
          const { _id: deleteCardId } = cardPayload.data;
          const deletedCard = await Card.findOneAndDelete(
            { _id: deleteCardId },
            { session }
          );
          if (!deletedCard) {
            throw new Error(`Card with id ${deleteCardId} not found`);
          }
          // Also delete associated links
          await Link.deleteMany(
            { $or: [{ from: deleteCardId }, { to: deleteCardId }] },
            { session }
          );
          console.log("Deleted card with id:", deleteCardId);
          break;
      }
    }

    // Process links
    for (const linkPayload of links) {
      switch (linkPayload.dbAction) {
        case "create":
          // Validate that referenced cards exist
          const fromCard = await Card.findById(linkPayload.data.from).session(
            session
          );
          const toCard = await Card.findById(linkPayload.data.to).session(
            session
          );
          if (!fromCard || !toCard) {
            throw new Error(
              `Referenced card not found: from=${linkPayload.data.from}, to=${linkPayload.data.to}`
            );
          }

          const newLink = await Link.create(
            [
              {
                _id: linkPayload.data._id,
                deckId: deckId,
                isDirected: linkPayload.data.isDirected,
                from: linkPayload.data.from,
                to: linkPayload.data.to,
                fromSide: linkPayload.data.fromSide,
                toSide: linkPayload.data.toSide,
                label: linkPayload.data.label,
              },
            ],
            { session }
          );
          console.log("Created link with id:", newLink[0]._id);
          break;

        case "update":
          const { _id: linkId, ...linkFields } = linkPayload.data;
          const updatedLink = await Link.findOneAndUpdate(
            { _id: linkId },
            {
              ...linkFields,
              from: linkFields.from,
              to: linkFields.to,
            },
            { new: true, session }
          );
          if (!updatedLink) {
            throw new Error(`Link with id ${linkId} not found`);
          }
          console.log("Updated link with id:", linkId);
          break;

        case "delete":
          const { _id: linkIdToDelete } = linkPayload.data;
          const deletedLink = await Link.findOneAndDelete(
            { _id: linkIdToDelete },
            { session }
          );
          if (!deletedLink) {
            throw new Error(`Link with id ${linkIdToDelete} not found`);
          }
          console.log("Deleted link with id:", linkIdToDelete);
          break;
      }
    }

    await session.commitTransaction();
    await session.endSession();

    // Return the updated graphdeck
    const updatedDeckInfo = await DeckInfo.findById(deckId);
    const updatedCards = await Card.find({ deckId: deckId });
    const updatedLinks = await Link.find({ deckId: deckId });

    const updatedGraphdeck = {
      _id: updatedDeckInfo!._id,
      name: updatedDeckInfo!.name,
      description: updatedDeckInfo!.description,
      cards: updatedCards,
      links: updatedLinks,
    };

    return response.status(200).json(successResponseObject(updatedGraphdeck));
  } catch (error) {
    console.log(error);

    await session.abortTransaction();
    await session.endSession();

    return response
      .status(500)
      .json(
        failureResponseObject("Server error. Could not update graphdeck", error)
      );
  }
}

export async function deleteGraphdeck(
  request: Request,
  response: Response
): Promise<Response> {
  const deckId = request.params.deckId;

  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return response.status(404).json({ error: "no such deck" });
  }

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const deckInfo = await DeckInfo.findOneAndDelete({
      _id: deckId,
    });

    if (!deckInfo) {
      return response
        .status(404)
        .json(failureResponseObject("could not find deck to delete it "));
    }

    await await Card.deleteMany({ deckId: deckId });
    await Link.deleteMany({ deckId: deckId });

    return response.status(200).json(successResponseObject(deckInfo));
  } catch (error) {
    return response
      .status(500)
      .json(
        failureResponseObject("server error. could not delete deck.", error)
      );
  }
}
