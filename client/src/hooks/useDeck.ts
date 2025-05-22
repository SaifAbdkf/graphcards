import useSWR from "swr";
import { fetchDeck } from "../services/api/deckRequests";
import { useGraphcardStore } from "../zustore/store";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useDeck(deckId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    deckId ? `/deck/${deckId}` : null,
    () => fetchDeck(deckId)
  );
  const setNodes = useGraphcardStore((state) => state.setNodes);
  const setEdges = useGraphcardStore((state) => state.setEdges);

  if (data) {
    const cardNodes = data.cards.map((card, index) => ({
      id: card._id,
      type: "cardNode",

      data: { ...card, toUpdate: false },
      position: { x: index * 100, y: 100 },
    }));
    setNodes(cardNodes);

    const linkEdges = data.links.map((link) => ({
      id: link._id,
      type: "LinkEdge",
      data: { ...link, toUpdate: false },
      isDirected: link.isDirected,
      label: link.label,
      source: link.from,
      target: link.to,
    }));
    setEdges(linkEdges);
  }

  return {
    data: data,
    error: error,
    isLoading,
    mutate,
  };
}
