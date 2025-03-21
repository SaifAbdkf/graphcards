import { Deck, DeckFormFields, DeckInfo } from "../Types/types";

export function dummy() {
  console.log("I am a dummy function 🏖️");
}

export const deepCopy = <T>(obj: T): T => structuredClone(obj);

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

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

export function deckFormFieldsFromDeck(deck: Deck): DeckFormFields {
  return {
    name: deck.name,
    description: deck.description,
  };
}

export function deckInfoFromDeck(deck: Deck): DeckInfo {
  return {
    _id: deck._id,
    name: deck.name,
    description: deck.description,
  };
}
