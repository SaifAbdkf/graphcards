import express from "express";

import { Deck } from "../models/DeckModel";
import {
  createDeck,
  deleteDeck,
  getDecksInfo,
  updateDeck,
} from "../controllers/DeckControllers";
import { cardRoutes } from "./CardRoutes";

export const deckRoutes = express.Router();

deckRoutes.post("/", createDeck);
deckRoutes.get("/all", getDecksInfo);
deckRoutes.patch("/:deckId", updateDeck);
deckRoutes.delete("/:deckId", deleteDeck);
deckRoutes.use("/:deckId/card", cardRoutes);
