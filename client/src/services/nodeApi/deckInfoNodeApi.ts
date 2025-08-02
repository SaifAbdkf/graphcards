import { ScopedMutator } from "swr";
import { DeckFields, DeckInfo } from "../../Types/appDataTypes";
import { DeckInfoAPIStrategy } from "../strategies/deckInfoStrategy";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const deckInfoNodeAPI: DeckInfoAPIStrategy = {
  fetchAllDecksInfo: async () => {
    const response = await fetch(`${BACKEND_URL}${"/deck/all"}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error!`);
    }
    const json = await response.json();

    if (json.status === "success") {
      return json.data;
    } else {
      throw new Error(json.message || "API error");
    }
  },

  createDeckInfo: async (deckFields: DeckFields, mutate: ScopedMutator) => {
    const response = await fetch(`${BACKEND_URL}/deck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deckFields),
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

  updateDeckInfo: async (
    deckId: string,
    deckFields: Partial<DeckInfo>,
    mutate: ScopedMutator
  ) => {
    const response = await fetch(`${BACKEND_URL}/deck/${deckId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deckFields),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error!`);
    }
    const json = await response.json();

    if (json.status === "success") {
      mutate("decksInfo");
      return json.data;
    } else {
      throw new Error(json.message || "API error");
    }
  },
};
