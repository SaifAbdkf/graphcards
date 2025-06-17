import useSWR from "swr";
import { fetchDeck } from "../services/api/deckRequests";
import { useGraphcardsStore } from "../store/store";
import { CardNode } from "../Types/appDataTypes";
import { DbAction } from "../Types/storageManagementTypes";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useDeck(deckId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    deckId ? `/deck/${deckId}` : null,
    () => fetchDeck(deckId)
  );
  const setNodes = useGraphcardsStore((state) => state.setNodes);
  const setEdges = useGraphcardsStore((state) => state.setEdges);

  if (data) {
    const cardNodes: CardNode[] = data.cards.map((card, index) => ({
      id: card._id,
      type: "cardNode",
      data: { ...card, dbAction: "none", editMode: false },
      position: { x: index * 100, y: 100 },
    }));
    setNodes(cardNodes);

    const linkEdges = data.links.map((link) => ({
      id: link._id,
      type: "LinkEdge",
      data: { ...link, dbAction: "none" as DbAction, editMode: false },
      isDirected: link.isDirected,
      label: link.label,
      source: link.from,
      target: link.to,
      sourceHandle: link.fromSide,
      targetHandle: link.toSide,
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
