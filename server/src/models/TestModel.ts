import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;

export const testShema = new Schema(
  {
    deckId: { type: Schema.Types.ObjectId, ref: "Deck", required: true },
    leitnerBox: { type: Number, required: true },
    testedCards: [{ type: Schema.Types.ObjectId, ref: "Card", required: true }],
  },
  { timesstamps: true, strict: false }
);

export const Test = mongoose.model("Test", testShema);

export type TestType = InferSchemaType<typeof testShema>;
