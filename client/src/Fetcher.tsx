import { ReactNode, useEffect } from "react";
import { useGraphcardsStore } from "./store/store";
import { useShallow } from "zustand/shallow";
import { CardNode } from "./Types/appDataTypes";
import { DbAction } from "./Types/storageManagementTypes";

import useSWR from "swr";
import { useDeckInfoApi } from "./hooks/useDeckInfoApi";
import { useGraphdeckApi } from "./hooks/useGraphDeckApi";

export default function Fetcher({ children }: { children: ReactNode }) {
  const activeDeck = useGraphcardsStore(
    useShallow((state) => state.activeDeckInfo)
  );
  const setDecksInfo = useGraphcardsStore(
    useShallow((state) => state.setDecksInfo)
  );
  const setNodes = useGraphcardsStore((state) => state.setNodes);
  const setEdges = useGraphcardsStore((state) => state.setEdges);
  const deckInfoAPI = useDeckInfoApi();
  const graphdeckApi = useGraphdeckApi();

  const fetcher = async () => {
    const fetchedDecksInfo = await deckInfoAPI.fetchAllDecksInfo();
    return fetchedDecksInfo;
  };
  const { data: decksInfoData } = useSWR("/decksInfo", fetcher);

  useEffect(() => {
    if (decksInfoData) {
      setDecksInfo(decksInfoData);
    }
  }, [decksInfoData, setDecksInfo]);

  useEffect(() => {
    const fetcher = async () => {
      if (activeDeck) {
        const fetchedDeck = await graphdeckApi.fetchGraphDeck(activeDeck._id);
        const cardNodes: CardNode[] = fetchedDeck.cards.map((card, index) => ({
          id: card._id,
          type: "cardNode",
          data: { ...card, dbAction: "none", editMode: false },
          position: { x: index * 100, y: 100 },
        }));
        setNodes(cardNodes);

        const linkEdges = fetchedDeck.links.map((link) => ({
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
    };
    fetcher();
  }, [activeDeck, graphdeckApi, setEdges, setNodes]);

  return <>{children}</>;
}
