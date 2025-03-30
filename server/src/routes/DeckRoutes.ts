import express from "express";

import {
  createDeck,
  deleteDeck,
  getDeck,
  getDecksInfo,
  patchDeck,
} from "../controllers/DeckControllers";
import { cardRoutes } from "./CardRoutes";

export const deckRoutes = express.Router();

deckRoutes.post("/", createDeck);
deckRoutes.get("/all", getDecksInfo); //match before /:deckId
deckRoutes.get("/:deckId", getDeck);
deckRoutes.patch("/:deckId", patchDeck);
deckRoutes.delete("/:deckId", deleteDeck);
