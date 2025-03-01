import express from "express";

import { Deck } from "../models/DeckModel";
import {
  createDeck,
  deleteDeck,
  getDeck,
  getDecksInfo,
  updateDeck,
} from "../controllers/DeckControllers";
import { cardRoutes } from "./CardRoutes";

export const deckRoutes = express.Router();

deckRoutes.post("/", createDeck);
deckRoutes.get("/all", getDecksInfo); //match before /:deckId
deckRoutes.get("/:deckId", getDeck);
deckRoutes.patch("/:deckId", updateDeck);
deckRoutes.delete("/:deckId", deleteDeck);
deckRoutes.use("/:deckId/card", cardRoutes);
