import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deckInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true, strict: false }
);

export const DeckInfo = mongoose.model("DeckInfo", deckInfoSchema);
