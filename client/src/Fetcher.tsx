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

  const decksInfoFetcher = async () => {
    const fetchedDecksInfo = await deckInfoAPI.fetchAllDecksInfo();
    return fetchedDecksInfo;
  };
  const { data: decksInfoData } = useSWR("decksInfo", decksInfoFetcher);

  useEffect(() => {
    if (decksInfoData) {
      setDecksInfo(decksInfoData);
    }
  }, [decksInfoData, setDecksInfo]);

  const graphdeckFetcher = async () => {
    if (activeDeck) {
      const fetchedGraphdeck = await graphdeckApi.fetchGraphdeck(
        activeDeck._id
      );
      return fetchedGraphdeck;
    }
  };

  const { data: graphdeckData } = useSWR(
    activeDeck?._id || null,
    graphdeckFetcher
  );

  useEffect(() => {
    console.log("setting new graphdeck in the store");

    if (graphdeckData) {
      const cardNodes: CardNode[] = graphdeckData.cards.map((card) => ({
        id: card._id,
        type: "cardNode",
        data: { ...card, dbAction: "none", editMode: false },
        position: { x: card.x || 0, y: card.y || 0 },
      }));
      setNodes(cardNodes);

      const linkEdges = graphdeckData.links.map((link) => ({
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
  }, [activeDeck, graphdeckApi, graphdeckData, setEdges, setNodes]);

  return <>{children}</>;
}
