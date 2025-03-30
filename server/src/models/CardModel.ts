import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    deckId: { type: Schema.Types.ObjectId, ref: "Deck", required: true },
    front: { type: String, required: true },
    back: {
      type: String,
      required: true,
      // false in case AI or user creates a link card to be filled later or maybe if it is a group Card?
    },
    links: {
      type: [{ linkedCardId: mongoose.Types.ObjectId, label: String }],
      ref: "Card",
      required: false,
    },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timesstamps: true, strict: false }
);

export const Card = mongoose.model("Card", cardSchema);
