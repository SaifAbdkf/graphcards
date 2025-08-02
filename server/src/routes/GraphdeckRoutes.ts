import express from "express";
import {
  deleteGraphdeck,
  getGraphdeck,
  updateGraphdeck,
} from "../controllers/GraphdeckControllers";

export const graphdeckRoutes = express.Router();

graphdeckRoutes.get("/:deckId", getGraphdeck);
graphdeckRoutes.post("", updateGraphdeck);
graphdeckRoutes.delete("/:deckId", deleteGraphdeck);
