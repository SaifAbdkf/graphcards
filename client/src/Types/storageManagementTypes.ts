import { Card, DeckInfo, Link } from "./appDataTypes";

// for import export JSON feature
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
