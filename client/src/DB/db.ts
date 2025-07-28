import Dexie, { EntityTable } from "dexie";

interface DeckInfo {
  id: string;
  name: string;
  description: string;
}

export const db = new Dexie("GraphcardsDB") as Dexie & {
  DeckInfo: EntityTable<DeckInfo, "id">;
};

db.version(1).stores({
  DeckInfo: "&id, name, age",
});
