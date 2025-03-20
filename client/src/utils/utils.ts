import { Deck, DeckBasicFields } from "../Types/types";

export function dummy() {
  console.log("I am a dummy function 🏖️");
}

export function deckBasicFieldsFromDeck(deck: Deck): DeckBasicFields {
  return {
    name: deck.name,
    description: deck.description,
  };
}
