import Dexie, { EntityTable } from "dexie";

interface DeckInfo {
  id: string;
  name: string;
  description: string;
  tests: Test[];
}

interface Card {
  id: string;
  deckId: string;
  x: number;
  y: number;
  front: string;
  back: string;
  leitnerBox: number; //1 to 7
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

export type Test = {
  box: number;
  // cardsTested: { cardId: string; score: number }[]; //add later maybe
  date: Date;
};

// await Dexie.delete("GraphcardsDB");

export const db = new Dexie("GraphcardsDB") as Dexie & {
  DeckInfo: EntityTable<DeckInfo, "id">;
  Card: EntityTable<Card, "id">;
  Link: EntityTable<Link, "id">;
};

db.version(1).stores({
  DeckInfo: "&id, name, description, tests",
  Card: "&id, deckId, x, y, front, back, leitnerBox",
  Link: "&id, deckId, isDirected, from, to, fromSide, toSide, label",
});
