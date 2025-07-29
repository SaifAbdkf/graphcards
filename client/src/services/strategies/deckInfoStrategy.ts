import { DeckFields, DeckInfo } from "../../Types/appDataTypes";

export interface DeckInfoAPIStrategy {
  fetchAllDecksInfo: () => Promise<DeckInfo[]>;
  createDeckInfo: (deckFields: DeckFields) => Promise<DeckInfo>;
  updateDeckInfo: (deckId: string, deckFields: DeckFields) => Promise<DeckInfo>;
}
