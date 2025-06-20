import { Deck, DeckInfo } from "../../Types/appDataTypes";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchDecksInfo(): Promise<DeckInfo[]> {
  const response = await fetch(`${BACKEND_URL}${"/deck/all"}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error!`);
  }
  const json = await response.json();

  if (json.status === "success") {
    return json.data;
  } else {
    throw new Error(json.message || "API error");
  }
}

export async function fetchDeck(deckId: string): Promise<Deck> {
  const response = await fetch(`${BACKEND_URL}${`/deck/${deckId}`}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error!`);
  }

  const json = await response.json();

  if (json.status === "success") {
    return json.dataSingular;
  } else {
    throw new Error(json.message || "API error");
  }
}
