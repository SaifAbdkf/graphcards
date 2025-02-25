import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    decks: [{ type: Schema.Types.ObjectId, ref: "Deck" }],
    front: { type: String, required: true },
    back: {
      type: String,
      required: false,
      // false in case AI or user creates a link card to be filled later or maybe if it is a group Card?
    },
    links: {
      type: [{ linkedCardId: mongoose.Types.ObjectId, label: String }],
      ref: "Card",
      required: false,
    },
    metadata: { type: Map, of: String },
  },
  { timesstamps: true, strict: false }
);

export const Card = mongoose.model("Card", cardSchema);
