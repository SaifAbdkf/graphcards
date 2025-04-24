import { RelatedCardInfo } from "../../constituants/CardPanel";
import { Card, CardFields } from "../../Types/types";
import { postRequest } from "./apiRequestMethods";

export async function createConnectedCardRequest(
  deckId: string,
  newCardFields: CardFields,
  relatedCards: RelatedCardInfo[]
) {
  const cardBody = {
    deckId: deckId,
    ...newCardFields,
    edges: relatedCards.map((relatedCard) => ({
      linkedCardId: relatedCard.card._id,
      ...relatedCard.edge,
    })),
  };
  const card: Card = await postRequest("/card", cardBody);
  return card;
}
