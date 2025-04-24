import { Deck, DeckFields, DeckInfo } from "../../Types/types";
import {
  BACKEND_URL,
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "./apiRequestMethods";

export async function fetchDeck(deckId: string | null): Promise<Deck> {
  if (!deckId) throw new Error("fetchDeck Error: deckId is null");
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

export async function createDeckInfoRequest(newDeckFields: DeckFields) {
  const deckInfo: DeckInfo = await postRequest<DeckFields>(
    "/deck/",
    newDeckFields
  );
  return deckInfo;
}

export async function getDeckRequest(deckId: string): Promise<Deck> {
  const deck: Deck = await getRequest(`/deck/${deckId}`);
  return deck;
}

export async function editDeckInfoRequest(
  deckId: string,
  deckFields: DeckFields
) {
  const isDeckUpdated = await patchRequest<DeckFields>(
    `/deck/${deckId}`,
    deckFields
  );
  return isDeckUpdated;
}

export async function deleteDeckRequest(deckId: string) {
  const isDeckDeleted = await deleteRequest(`/deck/${deckId}`);
  return isDeckDeleted;
}
