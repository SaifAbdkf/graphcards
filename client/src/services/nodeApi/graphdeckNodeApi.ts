import { ScopedMutator } from "swr";
import { GraphDeck, DeckInfo } from "../../Types/appDataTypes";
import { GraphdeckChangePayload } from "../../Types/storageManagementTypes";
import { BACKEND_URL } from "./deckInfoNodeApi";

export const graphdeckNodeApi = {
  fetchGraphdeck: async (deckId: string): Promise<GraphDeck> => {
    const response = await fetch(`${BACKEND_URL}${`/graphdeck/${deckId}`}`);
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
  updateGraphdeck: async (
    graphdeckUpdatePayload: GraphdeckChangePayload,
    mutate: ScopedMutator
  ) => {
    const response = await fetch(`${BACKEND_URL}/graphdeck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphdeckUpdatePayload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error!`);
    }
    const json = await response.json();
    console.log(json);

    await mutate(json.dataSingular._id);

    return json.dataSingular;
  },

  deleteGraphdeck: async (
    deckId: string,
    mutate: ScopedMutator
  ): Promise<DeckInfo> => {
    const response = await fetch(`${BACKEND_URL}/graphdeck/${deckId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error!`);
    }
    const json = await response.json();

    if (json.status === "success") {
      mutate("decksInfo");
      return json.dataSingular;
    } else {
      throw new Error(json.message || "API error");
    }
  },
};
