import { Request, Response } from "express";
import mongoose from "mongoose";
import { Card } from "../models/CardModel";
import { DeckInfo } from "../models/DeckModel";
import { Link } from "../models/LinkModel";
import { failureResponseObject, successResponseObject } from "../utils/utils";

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
