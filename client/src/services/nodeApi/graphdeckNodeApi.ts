import { GraphDeck, DeckInfo } from "../../Types/appDataTypes";
import { GraphdeckChangePayload } from "../../Types/storageManagementTypes";
import { BACKEND_URL } from "./deckInfoNodeApi";

export const graphdeckNodeApi = {
  updateGraphDeck: async (graphdeckUpdatePayload: GraphdeckChangePayload) => {
    const response = await fetch(`${BACKEND_URL}/graphdeck`, {
      method: "POST",
      body: JSON.stringify(graphdeckUpdatePayload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error!`);
    }
    const json = await response.json();
    return json.dataSingular;
  },

  fetchDeck: async (deckId: string): Promise<GraphDeck> => {
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
  },

  deleteDeck: async (deckId: string): Promise<DeckInfo> => {
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
  },
};
