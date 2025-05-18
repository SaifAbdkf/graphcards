import { Request, Response } from "express";
import { Card } from "../models/CardModel";
import mongoose from "mongoose";
import { Link } from "../models/LinkModel";
import { DeckInfo } from "../models/DeckModel";
import {
  ApiConnectedCardSchema,
  failureResponseObject,
  successResponseObject,
  validateLinks,
} from "../utils/utils";
import assert from "assert";

// Creates links attached to the card too.
// TODO maybe make function createCardAndLinks that is a transaction calling createCard and CreaeLink
export async function createCard(request: Request, response: Response) {
  const { deckId, front, back, links } = ApiConnectedCardSchema.parse(
    request.body
  );
  // TODO find a way to create a card where its linkedCards are not already created, but needs to be created

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    // validate deckInfo
    const deckInfo = await DeckInfo.findById(deckId);
    if (!deckInfo)
      return response
        .status(404)
        .json(failureResponseObject("deck could not be found"));

    const validatedDeckId = new mongoose.Types.ObjectId(deckId);

    //create card
    const newCard = await Card.create(
      [
        {
          deckId: validatedDeckId,
          front,
          back,
        },
      ],
      { session }
    );

    //validate links connect to existing cards
    const validatedLinksResponse = await validateLinks(links);
    if (validatedLinksResponse.status === "failure") {
      return response
        .status(404)
        .json(
          failureResponseObject(
            "some cards could not be found to created the requesed links"
          )
        );
    }

    assert(validatedLinksResponse.data);
    const validatedLinks = validatedLinksResponse.data;

    // create links
    for (const link of validatedLinks) {
      await Link.create(
        [
          {
            deckId: validatedDeckId,
            from: link.from ? link.from : newCard[0]._id,
            to: link.to ? link.to : newCard[0]._id,
            label: link.label,
            isDirected: link.isDirected,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    await session.endSession();
    // throw new Error("takhrali fih");
    return response.status(200).json(successResponseObject(newCard));
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    return response
      .status(500)
      .json(failureResponseObject("Server Error Could not create card", error));
  }
}

export async function getCard(request: Request, response: Response) {
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response
      .status(404)
      .json(failureResponseObject("Card Id not valid"));
  }
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return response.status(404).json(failureResponseObject("Card not found"));
    }
    return response.status(200).json(successResponseObject(card));
  } catch (error) {
    return response
      .status(500)
      .json(failureResponseObject("server error. Cannot get Card", error));
  }
}

export async function updateCard(
  request: Request,
  response: Response
): Promise<Response> {
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response
      .status(404)
      .json({ status: "failure", message: "Card Id not valid" });
  }

  try {
    const card = await Card.findOneAndReplace(
      { _id: cardId },
      { ...request.body }
    );

    if (!card) {
      return response.status(404).json({ error: "no such card" });
    }
    return response.status(200).json(successResponseObject(card));
  } catch (error: unknown) {
    console.error(error);
    return response
      .status(500)
      .json(
        failureResponseObject("Server error, could not update card", error)
      );
  }
}

export async function deleteCard(
  request: Request,
  response: Response
): Promise<Response> {
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response
      .status(404)
      .json(failureResponseObject("Card Id not valid"));
  }

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const card = await Card.findOneAndDelete({ _id: cardId });

    if (!card) {
      return response
        .status(404)
        .json(failureResponseObject("card not found to be deleted"));
    }

    await Link.deleteMany({ $or: [{ from: cardId }, { to: cardId }] });

    await session.commitTransaction();
    await session.endSession();

    return response.status(200).json(successResponseObject(card));
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    return response
      .status(500)
      .json(
        failureResponseObject("Server error. Could not delete card", error)
      );
  }
}
