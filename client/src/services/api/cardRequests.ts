import { Card, CardFields, EdgeFields } from "../../Types/types";
import { postRequest } from "./apiRequestMethods";

export async function createConnectedCardRequest(
  deckId: string,
  cardFields: CardFields,
  edgeFields: EdgeFields[]
) {
  const connectedCardBody = {
    deckId: deckId,
    ...cardFields,
    edges: edgeFields,
  };
  const card: Card = await postRequest("/card", connectedCardBody);
  return card;
}
