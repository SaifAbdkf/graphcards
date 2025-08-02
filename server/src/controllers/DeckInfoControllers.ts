import { Request, Response } from "express";
import { DeckInfo } from "../models/DeckModel";
import mongoose from "mongoose";
import { failureResponseObject, successResponseObject } from "../utils/utils";

export async function createDeckInfo(
  request: Request,
  response: Response
): Promise<Response> {
  const { name, description } = request.body;

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
