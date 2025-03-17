import { Deck, DeckFields, DeckInfo } from "../../Types/types";
import { getMultiple, getOne, post } from "./apiRequestMethods";

export async function getDecksInfo(): Promise<DeckInfo[]> {
  const fetchedDecksInfo: DeckInfo[] = await getMultiple("/deck/all");
  return fetchedDecksInfo;
}

export async function createDeck(newDeckFields: DeckFields) {
  const deck: Deck = await post<DeckFields>("/deck/", newDeckFields);
  return deck;
}

export async function getDeck(deckId: string) {
  const deck: Deck = await getOne<DeckFields>(`/deck/${deckId}`);
  return deck;
}
