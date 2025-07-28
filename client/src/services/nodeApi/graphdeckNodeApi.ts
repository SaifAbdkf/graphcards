import { Deck, DeckInfo } from "../../Types/appDataTypes";
import { BACKEND_URL } from "./deckInfoNodeApi";

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

export async function deleteDeck(deckId: string): Promise<DeckInfo> {
  const response = await fetch(`${BACKEND_URL}/deck/${deckId}`, {
    method: "DELETE",
  });
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
