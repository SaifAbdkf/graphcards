export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  edges: Edge[];
};

export type DeckInfo = Omit<Deck, "cards" | "edges">; // the metaDeck, deck - (edges and cards) //in the future will contain stats
export type DeckFields = Omit<Deck, "_id" | "cards" | "edges">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckFields: DeckFields = {
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
// if edge not created yet, set the node in creation to ""
export type EdgeFields = Omit<Edge, "_id" | "deckId">;
export const emptyEdgeFields: EdgeFields = {
  isDirected: false,
  from: "",
  to: "",
};

//PROJECT CONVETION
// IF EDGE IS UNDIRECTED FROM = THE CARD BEING CREATED, TO = already existing card
