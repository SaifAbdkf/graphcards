import { useCallback, useRef } from "react";
import styles from "./LabPage.module.scss";

import { useDecksInfo } from "../hooks/useDecksInfo";
import { useDeck } from "../hooks/useDeck";
import Graph from "../constituants/Graph";
import { ReactFlowProvider } from "@xyflow/react";
import { useShallow } from "zustand/shallow";

import { useGraphcardsStore } from "../store/store";
import LabBar from "../constituants/LabBar";
import { useLabView } from "../store/UISlice";
import GraphDecksPage from "./GraphDecksPage";

export default function LabPage() {
  const { labView } = useLabView();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeDeckInfo = useGraphcardsStore(
    useShallow((state) => state.activeDeckInfo)
  );

  const setActiveDeckInfo = useGraphcardsStore(
    useShallow((state) => state.setActiveDeckInfo)
  );

  const {
    data: decksInfo,
    // error: decksInfoError,
    // isLoading: isLoadingDecksInfo,
  } = useDecksInfo();
  const {
    data: selectedDeck,
    // error: errorDeck,
    isLoading: isLoadingDeck,
    // mutate: mutateDeck,
  } = useDeck(activeDeckInfo?._id || null);

  const handleDeckSelection = useCallback(
    (deckId: string) => {
      const activeDeckInfo = decksInfo.find(
        (deckInfo) => deckInfo._id === deckId
      );
      if (activeDeckInfo) {
        setActiveDeckInfo({ ...activeDeckInfo, dbAction: "none" });
      }
    },
    [decksInfo, setActiveDeckInfo]
  );

  // TODO: loading UI
  if (isLoadingDeck) return <h1>Loading deck</h1>;

  if (!activeDeckInfo && selectedDeck) {
    console.log(
      "PROBLEM: selectedDeckId is not defined but selectedDeck is defined"
    );
  }

  return (
    <div className={styles.labContainer}>
      <LabBar />
      {labView === "graphdecks" ? (
        <GraphDecksPage />
      ) : (
        <div ref={containerRef} className={styles.canvasContainer}>
          <ReactFlowProvider>
            <Graph />
          </ReactFlowProvider>
        </div>
      )}
    </div>
  );
}
