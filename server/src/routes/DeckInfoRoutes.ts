import express from "express";

import {
  createDeckInfo,
  getDecksInfo,
  patchDeckInfo,
} from "../controllers/DeckInfoControllers";

export const deckInfoRoutes = express.Router();

deckInfoRoutes.post("/", createDeckInfo);
deckInfoRoutes.get("/all", getDecksInfo); //match before /:deckId
deckInfoRoutes.patch("/:deckId", patchDeckInfo);
