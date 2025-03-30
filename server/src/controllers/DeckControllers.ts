import { Request, Response } from "express";
import { Deck } from "../models/DeckModel";
import mongoose from "mongoose";
import { Card } from "../models/CardModel";

export async function createDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const { name, description } = request.body;

  try {
    const deck = await Deck.create({ name, description });
    return response.status(200).json(deck);
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
    console.log("Hey I am here 😎");
    const decks = await Deck.find({}, "-cardIds ");
    if (!decks) {
      return response.status(404).json({ error: "no decks" });
    }
    return response.status(200).json(decks);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, admMsg: "error fetching decks info" });
  }
}

export async function getDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const { deckId } = request.params;

  try {
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return response.status(404).json({ error: "no deck" });
    }

    const deckCards = await Card.find({ _id: { $in: deck.cardIds } });

    const returnedDeck = {
      _id: deck._id,
      name: deck.name,
      description: deck.description,
      cards: deckCards,
    };
    return response.status(200).json(returnedDeck);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, gMessage: "error fetching the deck" });
  }
}

export async function patchDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const deckId = request.params.deckId;

  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return response.status(404).json({ error: "no such deck" });
  }
  try {
    const deck = await Deck.findOneAndUpdate(
      {
        _id: deckId,
      },
      { ...request.body },
      { new: true }
    );

    if (!deck) {
      return response.status(404).json({ error: "no such deck" });
    }

    return response.status(200).json(deck);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, gMessage: "Server Error" });
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

  try {
    const deck = await Deck.findOneAndDelete({
      _id: deckId,
    });

    if (!deck) {
      return response.status(404).json({ error: "no such deck" });
    } else {
      //delete associatedCards
      //Carefull we are not checking if cards are deleted properly or not here
      await Card.deleteMany({ deckId: deckId });
    }

    return response.status(200).json(deck);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, gMessage: "server error" });
  }
}
