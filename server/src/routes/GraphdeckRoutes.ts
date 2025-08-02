import express from "express";
import {
  deleteGraphdeck,
  getGraphdeck,
} from "../controllers/GraphdeckControllers";

export const graphdeckRoutes = express.Router();

graphdeckRoutes.get("/:deckId", getGraphdeck);
graphdeckRoutes.delete("/:deckId", deleteGraphdeck);
// graphdeckRoutes.post("/updateGraphdeck/:deckId", updateGraphdeck);
