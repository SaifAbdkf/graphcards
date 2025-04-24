import { Deck, DeckFormFields, DeckInfo } from "../../Types/types";
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

export async function createDeckInfoRequest(newDeckFields: DeckFormFields) {
  const deckInfo: DeckInfo = await postRequest<DeckFormFields>(
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
  deckFormFields: DeckFormFields
) {
  const isDeckUpdated = await patchRequest<DeckFormFields>(
    `/deck/${deckId}`,
    deckFormFields
  );
  return isDeckUpdated;
}

export async function deleteDeckRequest(deckId: string) {
  const isDeckDeleted = await deleteRequest(`/deck/${deckId}`);
  return isDeckDeleted;
}
