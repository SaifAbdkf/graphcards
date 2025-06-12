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

// LinkData contains the information needed to build he graph and update db that is not already found in

export type AppCard = Card & {
  dbAction: DbAction;
  editMode: boolean;
};

export type AppLink = Link & {
  dbAction: DbAction;
  editMode: boolean;
};

export type AppDeckInfo = DeckInfo & {
  dbAction: DbAction;
};

export type CardNode = Node<AppCard>;
export type LinkEdge = Edge<AppLink>;

export type GraphcardsState = {
  activeDeckInfo: AppDeckInfo | null;
  nodes: CardNode[];
  edges: LinkEdge[];
  deletedNodes: CardNode[];
  deletedEdges: LinkEdge[];
  onNodesChange: OnNodesChange<CardNode>;
  onEdgesChange: OnEdgesChange<LinkEdge>;
  onConnect: OnConnect;
  setActiveDeckInfo: (deckInfo: DeckInfo & { dbAction: DbAction }) => void;
  setNodes: (nodes: CardNode[]) => void;
  setEdges: (edges: LinkEdge[]) => void;
  addNode: (node: CardNode) => void;
  setNodeEditMode: (nodeID: string, editMode: boolean) => void;
  setNodeCardFields: (nodeId: string, data: CardFields) => void;
  setEdgeEditMode: (edgeId: string, editMode: boolean) => void;
  setLinkEdgeFields: (edgeId: string, data: LinkFields) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
};

export type DbAction = "create" | "update" | "none";

export type DeckInfoPayload = {
  dbAction: DbAction;
  data: DeckInfo;
} | null;

export type CardPayload = {
  dbAction: DbAction;
  data: Card;
};

export type LinkPayload = {
  dbAction: DbAction;
  data: Link;
};

export type UpdateGraphPayload = {
  // deckInfo: DeckInfoPayload; // TODO when I transform decks to canvas
  cards: CardPayload[];
  links: LinkPayload[];
};

//PROJECT CONVETION
// IF EDGE IS UNDIRECTED FROM = THE CARD BEING CREATED, TO = already existing card
