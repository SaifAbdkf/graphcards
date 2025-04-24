export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  edges: Edge[];
};

export type DeckInfo = Omit<Deck, "cards" | "edges">; // the metaDeck, deck - (edges and cards) //in the future will contain stats
export type DeckFormFields = Omit<Deck, "_id" | "cards" | "edges">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckFormFields: DeckFormFields = {
  name: "",
  description: "",
};

export type Card = {
  _id: string;
  deckId: string;
  front: string;
  back: string;
};
export type CardFields = Omit<Card, "_id" | "deckId">;
export const emptyCardFields: CardFields = {
  front: "",
  back: "",
};

export type Edge = {
  _id: string;
  deckId: string;
  isDirected: boolean;
  from: string;
  to: string;
  label?: string;
};
// used when creting a card and its connection
// null referring to the id of the card in creation
export type EdgeFields =
  | {
      isDirected: boolean;
      from: string;
      to: null;
      label?: string;
    }
  | {
      isDirected: boolean;
      from: null;
      to: string;
      label?: string;
    };
