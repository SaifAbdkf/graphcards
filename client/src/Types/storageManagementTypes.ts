import { Card, CardFields, Link, LinkFields } from "./appDataTypes";

// for import export JSON feature
export type DbAction = "create" | "update" | "delete" | "none";

export type CardChangePayload =
  | CardCreatePayload
  | CardUpdatePayload
  | CardDeletePayload;

export type CardCreatePayload = {
  dbAction: "create";
  data: CardFields;
};

export type CardUpdatePayload = {
  dbAction: "update";
  data: Card;
};

export type CardDeletePayload = {
  dbAction: "delete";
  data: Card;
};

export type LinkChangePayload =
  | LinkCreatePayload
  | LinkUpdatePayload
  | LinkDeletePayload;

export type LinkCreatePayload = {
  dbAction: "create";
  data: LinkFields;
};

export type LinkUpdatePayload = {
  dbAction: "update";
  data: Link;
};

export type LinkDeletePayload = {
  dbAction: "delete";
  data: Link;
};

export type GraphdeckChangePayload = {
  deckId: string;
  cards: CardChangePayload[];
  links: LinkChangePayload[];
};
