import Dexie, { EntityTable } from "dexie";

interface DeckInfo {
  id: string;
  name: string;
  description: string;
}

interface Card {
  id: string;
  deckId: string;
  x: number;
  y: number;
  front: string;
  back: string;
}

export type Link = {
  id: string;
  deckId: string;
  isDirected: boolean;
  from: string;
  to: string;
  fromSide: string;
  toSide: string;
  label?: string;
};

// await Dexie.delete("GraphcardsDB");

export const db = new Dexie("GraphcardsDB") as Dexie & {
  DeckInfo: EntityTable<DeckInfo, "id">;
  Card: EntityTable<Card, "id">;
  Link: EntityTable<Link, "id">;
};

db.version(1).stores({
  DeckInfo: "&id, name, description",
  Card: "&id, deckId, x, y, front, back",
  Link: "&id, deckId, isDirected, from, to, fromSide, toSide, label",
});
