import express from "express";

import {
  createCard,
  deleteCard,
  getCard,
  updateCard,
} from "../controllers/CardControllers";

export const cardRoutes = express.Router();

cardRoutes.post("/", createCard);
cardRoutes.get("/:cardId", getCard);
cardRoutes.delete("/:cardId", deleteCard);
cardRoutes.patch("/:cardId", updateCard);
