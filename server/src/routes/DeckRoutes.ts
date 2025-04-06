import express from "express";

import {
  createDeck,
  deleteDeck,
  getDeck,
  getDecksInfo,
  patchDeckInfo,
} from "../controllers/DeckControllers";

export const deckRoutes = express.Router();

deckRoutes.post("/", createDeck);
deckRoutes.get("/all", getDecksInfo); //match before /:deckId
deckRoutes.get("/:deckId", getDeck);
deckRoutes.patch("/:deckId", patchDeckInfo);
deckRoutes.delete("/:deckId", deleteDeck);
