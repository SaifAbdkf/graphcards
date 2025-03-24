import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deckSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    edges: [{ type: Schema.Types.ObjectId, ref: "Edgez" }],
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true, strict: false }
);

export const Deck = mongoose.model("Deck", deckSchema);
