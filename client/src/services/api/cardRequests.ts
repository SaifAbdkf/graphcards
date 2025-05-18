import { Card, CardFields, LinkFields } from "../../Types/types";
import { postRequest } from "./apiRequestMethods";

export async function createConnectedCardRequest(
  deckId: string,
  cardFields: CardFields,
  linkFields: LinkFields[]
) {
  const connectedCardBody = {
    deckId: deckId,
    ...cardFields,
    links: linkFields,
  };
  const card: Card = await postRequest("/card", connectedCardBody);
  return card;
}
