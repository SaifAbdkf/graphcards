import { Deck, DeckInfo } from "../../Types/types";
import { get, post } from "./apiRequestMethods";

export async function getDecksInfo(): Promise<DeckInfo[]> {
  const fetchedDecksInfo: DeckInfo[] = await get("/deck/all");
  return fetchedDecksInfo;
}

export async function createDeck(newDeckFields: NewDeckFields) {
  const deck: Deck = await post<NewDeckFields>("/deck/", newDeckFields);
  return deck;
}
