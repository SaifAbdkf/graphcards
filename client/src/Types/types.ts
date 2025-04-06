export type Card = {
  _id: string;
  deckId: string;
  front: string;
  back: string;
};

export type Edge = {
  _id: string;
  deckId: string;
  from: string;
  to: string;
  label: string;
};

export type CardFields = Omit<Card, "_id" | "deckId">;

export const emptyCardFields: CardFields = {
  front: "",
  back: "",
};

export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  edges: Edge[];
};

export type DeckInfo = Omit<Deck, "cards" | "edges">; // in the future will contain stats
export type DeckFields = Omit<Deck, "_id">; // fields is anything changeable through a form, here it is title and desscription
export type DeckFormFields = Omit<Deck, "_id" | "cards" | "edges">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckFormFields: DeckFormFields = {
  name: "",
  description: "",
};
