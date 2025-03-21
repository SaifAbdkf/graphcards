import { Deck, DeckBasicFields } from "../Types/types";

export function dummy() {
  console.log("I am a dummy function 🏖️");
}

export const deepCopy = <T>(obj: T): T => structuredClone(obj);

export function assertNotNull<T>(
  param: T | null | undefined,
  message?: string
) {
  if (param == null) {
    throw new Error(message || "value cannot be null");
  }

  if (param == undefined) {
    throw new Error(message || "value cannot be undefined");
  }
}

export function deckBasicFieldsFromDeck(deck: Deck): DeckBasicFields {
  return {
    name: deck.name,
    description: deck.description,
  };
}
