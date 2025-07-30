import { ScopedMutator } from "swr";
import { DeckFields, DeckInfo } from "../../Types/appDataTypes";
import { DatabaseType } from "../../Types/storeTypes";
import { deckInfoDexieAPI } from "../dexieApi/DeckinfoDexieApi";
import { deckInfoNodeAPI } from "../nodeApi/deckInfoNodeApi";

export interface DeckInfoAPIStrategy {
  fetchAllDecksInfo: () => Promise<DeckInfo[]>;
  createDeckInfo: (
    deckFields: DeckFields,
    mutate: ScopedMutator
  ) => Promise<DeckInfo>;
  updateDeckInfo: (
    deckId: string,
    deckFields: DeckFields,
    mutate: ScopedMutator
  ) => Promise<DeckInfo>;
}

export function getDeckInfoAPIStrategy(
  databaseType: DatabaseType
): DeckInfoAPIStrategy {
  return databaseType === "local" ? deckInfoDexieAPI : deckInfoNodeAPI;
}
