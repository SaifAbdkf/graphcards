import { Edge, Node } from "@xyflow/react";
import { DbAction } from "./storageManagementTypes";

export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  links: Link[];
  // viewport: ViewportData; //TODO to save the state of the viewport in db
};

export type DeckInfo = Omit<Deck, "cards" | "links">; // the metaDeck, deck - (edges and cards) //in the future will contain stats
export type DeckFields = Omit<Deck, "_id" | "cards" | "links">; // fields is anything changeable through a form, here it is title and desscription
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
};
export type CardFields = {
  front: string;
  back: string;
};
export const emptyCardFields: CardFields = {
  front: "",
  back: "",
};

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
// if edge not created yet, set the node in creation to ""
export type LinkFields = Omit<Link, "_id" | "deckId">;
export const emptyLinkFields: LinkFields = {
  isDirected: false,
  from: "",
  to: "",
  fromSide: "bottom",
  toSide: "top",
};

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

//PROJECT CONVENTION
// IF EDGE IS UNDIRECTED FROM := THE CARD BEING CREATED, TO := already existing card
