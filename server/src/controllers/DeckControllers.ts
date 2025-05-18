import { Request, Response } from "express";
import { DeckInfo } from "../models/DeckModel";
import mongoose from "mongoose";
import { Card } from "../models/CardModel";
import { Link } from "../models/LinkModel";
import { failureResponseObject, successResponseObject } from "../utils/utils";

export async function createDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const { name, description } = request.body;
  // TODO: in he future we are gonna have an array of cards and links in the body maybe

  try {
    const deckInfo = await DeckInfo.create({ name, description });
    return response.status(200).json(successResponseObject(deckInfo));
  } catch (error) {
    console.log(error);
    return response.status(400).json(error);
  }
}

export async function getDecksInfo(
  request: Request,
  response: Response
): Promise<Response> {
  try {
    const decks = await DeckInfo.find();
    if (!decks) {
      return response.status(404).json(failureResponseObject("No decks found"));
    }
    return response.status(200).json(successResponseObject(decks));
  } catch (error) {
    return response
      .status(500)
      .json(failureResponseObject("Server error. Could not get decks.", error));
  }
}

export async function getDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const { deckId } = request.params;

  try {
    const deckInfo = await DeckInfo.findById(deckId);
    if (!deckInfo) {
      return response
        .status(404)
        .json(failureResponseObject("deckInfo not found"));
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
          "error getting the deck and its nodes and links",
          error
        )
      );
  }
}

export async function patchDeckInfo(
  request: Request,
  response: Response
): Promise<Response> {
  const deckId = request.params.deckId;

  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return response
      .status(404)
      .json(failureResponseObject("deck Id not valid"));
  }
  try {
    const updatedDeckInfo = await DeckInfo.findOneAndUpdate(
      {
        _id: deckId,
      },
      { ...request.body },
      { new: true }
    );

    if (!updatedDeckInfo) {
      return response
        .status(404)
        .json(failureResponseObject("deckInfo not found. could not update"));
    }

    return response.status(200).json(successResponseObject(updatedDeckInfo));
  } catch (error) {
    return response
      .status(500)
      .json(
        failureResponseObject("ssrver error. could not update deck.", error)
      );
  }
}

export async function deleteDeck(
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
