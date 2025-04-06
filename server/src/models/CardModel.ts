import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;

export const cardSchema = new Schema(
  {
    deckId: { type: Schema.Types.ObjectId, ref: "Deck", required: true },
    front: { type: String, required: true },
    back: {
      type: String,
      required: true,
      // false in case AI or user creates a link card to be filled later or maybe if it is a group Card?
    },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  { timesstamps: true, strict: false }
);

export const Card = mongoose.model("Card", cardSchema);

export type CardType = InferSchemaType<typeof cardSchema>;
