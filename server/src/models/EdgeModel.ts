import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const edgeSchema = new Schema(
  {
    deckId: { type: mongoose.Types.ObjectId, ref: "Deck" },
    from: { type: mongoose.Types.ObjectId, ref: "Card", required: true },
    to: { type: mongoose.Types.ObjectId, ref: "Card", required: true },
    label: { type: String, required: false },
    metadata: { type: Map, of: String },
  },
  { timestamps: true, strict: false }
);

export const Edge = mongoose.model("Edge", edgeSchema);
