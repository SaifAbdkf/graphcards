import useSWR from "swr";
import { Deck } from "../Types/types";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useDeck(deckId: string | null) {
  const { data, error, isLoading } = useSWR(
    deckId ? `/deck/${deckId}` : null,
    () => fetchDeck(deckId)
  );
  //   if (!deckId)
  //     return { data: undefined, error: "no deck selected", isLoading: false };
  if (data) {
    return {
      data: data[0],
      error: error,
      isLoading,
    };
  } else {
    return {
      data: data,
      error: error,
      isLoading,
    };
  }
}

export async function fetchDeck(deckId: string | null): Promise<Deck[]> {
  if (!deckId) throw new Error("fetchDeck Error: deckId is null");
  const response = await fetch(`${BACKEND_URL}${`/deck/${deckId}`}`);
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
}
