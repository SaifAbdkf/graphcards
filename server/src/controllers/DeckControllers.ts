import { Request, Response } from "express";
import { Deck } from "../models/DeckModel";
import mongoose from "mongoose";

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
    const decks = await Deck.find({}, "-cards");
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
    return response.status(200).json(deck);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, admMsg: "error fetching the deck" });
  }
}

export async function updateDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const deckId = request.params.deckId;

  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return response.status(404).json({ error: "no such deck" });
  }

  const deck = await Deck.findOneAndUpdate(
    {
      _id: deckId,
    },
    { ...request.body }
  );

  if (!deck) {
    return response.status(404).json({ error: "no such deck" });
  }

  return response.status(200).json(deck);
}

export async function deleteDeck(
  request: Request,
  response: Response
): Promise<Response> {
  const deckId = request.params.deckId;

  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return response.status(404).json({ error: "no such deck" });
  }

  const deck = await Deck.findOneAndDelete({
    _id: deckId,
  });

  if (!deck) {
    return response.status(404).json({ error: "no such deck" });
  }

  return response.status(200).json(deck);
}
