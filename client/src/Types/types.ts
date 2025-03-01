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

export type DeckInfo = Omit<Deck, "cards">;

export type DeckFields = Omit<Deck, "_id">;
export const emptyDeckFields: DeckFields = {
  name: "",
  description: "",
  cards: [],
};
