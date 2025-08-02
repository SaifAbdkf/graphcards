import express from "express";
import dotenv from "dotenv";
import { cardRoutes } from "./routes/CardRoutes";
import mongoose from "mongoose";
import cors from "cors";
import "fs";
import "path";
import { graphdeckRoutes } from "./routes/GraphdeckRoutes";
import { deckInfoRoutes } from "./routes/DeckInfoRoutes";

dotenv.config();
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/card", cardRoutes);
app.use("/api/deckinfo", deckInfoRoutes);
app.use("/api/graphdeck", graphdeckRoutes);

//CONNECT TO DB
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      // LISTEN
      app.listen(process.env.PORT, () => {
        console.log(
          `connected to DB & Server is running on http://localhost:${process.env.PORT}`
        );
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
