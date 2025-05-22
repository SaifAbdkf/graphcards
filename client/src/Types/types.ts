import {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

export type Deck = {
  _id: string;
  name: string;
  description: string;
  cards: Card[];
  links: Link[];
};

export type DeckInfo = Omit<Deck, "cards" | "links">; // the metaDeck, deck - (edges and cards) //in the future will contain stats
export type DeckFields = Omit<Deck, "_id" | "cards" | "links">; // fields is anything changeable through a form, here it is title and desscription
export const emptyDeckFields: DeckFields = {
  name: "",
  description: "",
};

export type Card = {
  _id: string;
  deckId: string; //is this needed?
  front: string;
  back: string;
};
export type CardFields = Omit<Card, "_id" | "deckId">;
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

// LinkData contains the information needed to build he graph and update db that is not already found in

export type CardNode = Node<Card & { toUpdate: boolean }>;
export type LinkEdge = Edge<Link & { toUpdate: boolean }> & {
  type: string;
  data: Link & { toUpdate: boolean };
};

export type GraphcardsState = {
  activeDeckInfo: DeckInfo | null;
  nodes: CardNode[];
  edges: LinkEdge[];
  onNodesChange: OnNodesChange<CardNode>;
  onEdgesChange: OnEdgesChange<LinkEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: CardNode[]) => void;
  setEdges: (edges: LinkEdge[]) => void;
};

//PROJECT CONVETION
// IF EDGE IS UNDIRECTED FROM = THE CARD BEING CREATED, TO = already existing card

export function cardHandleToSide(cardHandle: string | null) {
  switch (cardHandle) {
    case "1":
      return "top";
    case "2":
      return "bottom";
    case "3":
      return "left";
    case "4":
      return "right";
    default:
      throw Error("card Handle no match case");
  }
}
