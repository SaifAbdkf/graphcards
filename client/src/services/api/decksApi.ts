import { Deck, DeckFields, DeckInfo } from "../../Types/types";
import {
  deleteRequest,
  getMultipleRequest,
  getOneRequest,
  postRequest,
} from "./apiRequestMethods";

export async function getDecksInfoRequest(): Promise<DeckInfo[]> {
  const fetchedDecksInfo: DeckInfo[] = await getMultipleRequest("/deck/all");
  return fetchedDecksInfo;
}

export async function createDeckRequest(newDeckFields: DeckFields) {
  const deck: Deck = await postRequest<DeckFields>("/deck/", newDeckFields);
  return deck;
}

export async function getDeckRequest(deckId: string): Promise<Deck> {
  const deck: Deck = await getOneRequest<DeckFields>(`/deck/${deckId}`);
  return deck;
}

export async function deleteDeckRequest(deckId: string) {
  const isDeckDeleted = await deleteRequest(`/deck/${deckId}`);
  return isDeckDeleted;
}
