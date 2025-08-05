import { Edge, Node } from "@xyflow/react";
import { DbAction } from "./storageManagementTypes";

export type GraphDeck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  links: Link[];
  // viewport: ViewportData; //TODO to save the state of the viewport in db
};

export type DeckInfo = Omit<GraphDeck, "cards" | "links">; // the metaDeck, deck - (edges and cards) //in the future will contain stats
export type DeckFields = Omit<GraphDeck, "_id" | "cards" | "links">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckFields: DeckFields = {
  name: "",
  description: "",
};

export type Card = {
  _id: string;
  deckId: string;
  x: number;
  y: number;
  front: string;
  back: string;
  leitnerBox: number;
};

export type Test = {
  _id: string;
  deckId: string;
  leitnerBox: number;
  testedCards: { cardId: string; score: number }[];
  date: Date;
};

export type CardFields = Omit<Card, "_id">;

export type Link = {
  _id: string;
  deckId: string;
  isDirected: boolean;
  from: string;
  to: string;
  fromSide: string;
  toSide: string;
  label?: string;
};
export type LinkFields = Omit<Link, "_id">;

export type AppCard = Card & {
  dbAction: DbAction;
  editMode: boolean;
};

export type AppLink = Link & {
  dbAction: DbAction;
  editMode: boolean;
};

export type CardNode = Node<AppCard>;
export type LinkEdge = Edge<AppLink>;

export type TestGraphdeckCard = Card & {
  toTest: boolean;
};

//PROJECT CONVENTION
// IF EDGE IS UNDIRECTED FROM := THE CARD BEING CREATED, TO := already existing card
