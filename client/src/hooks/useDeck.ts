import useSWR from "swr";
import { fetchDeck } from "../services/api/deckRequests";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useDeck(deckId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    deckId ? `/deck/${deckId}` : null,
    () => fetchDeck(deckId)
  );

  return {
    data: data,
    error: error,
    isLoading,
    mutate,
  };
}
