import { Card, CardFields, Link, LinkFields } from "./appDataTypes";

// for import export JSON feature
export type DbAction = "create" | "update" | "delete" | "none";

export type CardChangePayload = {
  dbAction: "create" | "update" | "delete";
  data: Card;
};

export type LinkChangePayload = {
  dbAction: "create" | "update" | "delete";
  data: Link;
};

export type GraphdeckChangePayload = {
  deckId: string;
  cards: CardChangePayload[];
  links: LinkChangePayload[];
};
