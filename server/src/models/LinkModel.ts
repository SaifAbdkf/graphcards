import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const linkSchema = new Schema(
  {
    deckId: { type: mongoose.Types.ObjectId, ref: "Deck" },
    isDirected: { type: Boolean, required: false },
    from: { type: mongoose.Types.ObjectId, ref: "Card", required: true },
    to: { type: mongoose.Types.ObjectId, ref: "Card", required: true },
    label: { type: String, required: false },
    metadata: { type: Map, of: String },
  },
  { timestamps: true, strict: false }
);

export const Link = mongoose.model("Link", linkSchema);

export type LinkType = mongoose.InferSchemaType<typeof linkSchema>;
