export type Card = {
  _id: string;
  front: string;
  back: string;
  linkedCards: string[];
};
export type CardFields = Omit<Card, "_id">;

export const emptyCardFields: CardFields = {
  front: "",
  back: "",
  linkedCards: [],
};

export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
};

export type DeckInfo = Omit<Deck, "cards">; // in the future will contain stats
export type DeckFields = Omit<Deck, "_id">; // fields is anything changeable through a form, here it is title and desscription
export type DeckBasicFields = Omit<Deck, "_id" | "cards">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckBasicFields: DeckBasicFields = {
  name: "",
  description: "",
};
