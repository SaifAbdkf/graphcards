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
  leitnerBox: number; //1 to 7
}

interface Link {
  id: string;
  deckId: string;
  isDirected: boolean;
  from: string;
  to: string;
  fromSide: string;
  toSide: string;
  label?: string;
}

interface Test {
  id: string;
  deckId: string;
  leitnerBox: number;
  testedCards: { cardId: string; score: number }[];
  createdAt: string;
}

// await Dexie.delete("GraphcardsDB");

export const db = new Dexie("GraphcardsDB") as Dexie & {
  DeckInfo: EntityTable<DeckInfo, "id">;
  Card: EntityTable<Card, "id">;
  Link: EntityTable<Link, "id">;
  Test: EntityTable<Test, "id">;
};

db.version(1).stores({
  DeckInfo: "&id, name, description, tests",
  Card: "&id, deckId, x, y, front, back, leitnerBox",
  Link: "&id, deckId, isDirected, from, to, fromSide, toSide, label",
  Test: "&id, deckId, leitnerBox, testedCards, createdAt",
});

db.Test.hook("creating", (_, test) => {
  if (!test.createdAt) {
    test.createdAt = new Date().toISOString();
  }
});
