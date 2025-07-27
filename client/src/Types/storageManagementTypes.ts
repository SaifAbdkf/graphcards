import { Card, Link } from "./appDataTypes";

// for import export JSON feature
export type DbAction = "create" | "update" | "none";

export type CardPayload = {
  dbAction: DbAction;
  data: Card;
};

export type LinkPayload = {
  dbAction: DbAction;
  data: Link;
};

export type UpdateGraphPayload = {
  deckId: string;
  cards: CardPayload[];
  links: LinkPayload[];
};
