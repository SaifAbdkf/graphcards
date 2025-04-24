import { RelatedCardInfo } from "../../constituants/CardPanel";
import { Card, CardFields } from "../../Types/types";
import { postRequest } from "./apiRequestMethods";

export function createConnectedCardRequest(
  deckId: string,
  newCardFields: CardFields,
  relatedCards: RelatedCardInfo[]
) {
  const card: Card = await postRequest<CardFields>("/");
}
