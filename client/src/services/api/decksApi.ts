import { Deck, DeckFields, DeckFormFields, DeckInfo } from "../../Types/types";
import {
  deleteRequest,
  getMultipleRequest,
  getOneRequest,
  patchRequest,
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

export async function editDeckFormFieldsRequest(
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
