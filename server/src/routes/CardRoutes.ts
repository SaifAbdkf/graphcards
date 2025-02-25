import express from "express";

import {
  createCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
} from "../controllers/CardControllers";

// "/api/deck/:deckId/card"
// export const cardRoutes = express.Router({ mergeParams: true });
// to allow the cards router to access the parent routers params
export const cardRoutes = express.Router();

//TODO change the routes and the functions names
cardRoutes.post("/", createCard);
cardRoutes.get("/all", getCards);
cardRoutes.get("/:cardId", getCard);
cardRoutes.delete("/:cardId", deleteCard);
cardRoutes.put("/:cardId", updateCard);
