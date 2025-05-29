import { useCallback, useRef, useState } from "react";
import styles from "./PlaygroundPage.module.scss";
import { Link } from "react-router-dom";
import CardPanel from "../constituants/CardPanel";

import { useDecksInfo } from "../hooks/useDecksInfo";
import { useDeck } from "../hooks/useDeck";
import Graph from "../constituants/Graph";
import { Plus, Save } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import {
  CardPayload,
  DeckInfoPayload,
  LinkPayload,
  UpdateGraphPayload,
} from "../Types/types";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeDeckInfo = useGraphcardStore(
    useShallow((state) => state.activeDeckInfo)
  );

  const [showCardPanel, setShowCardPanel] = useState<boolean>(false);

  const setActiveDeckInfo = useGraphcardStore(
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
    mutate: mutateDeck,
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

  const handleSaveGraphDeck = useCallback(() => {
    const { activeDeckInfo, nodes, edges } = useGraphcardStore.getState();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let deckInfoPayload: DeckInfoPayload = null;
    if (activeDeckInfo && activeDeckInfo.dbAction !== "none") {
      const { dbAction: deckInfoDbAction, ...deckInfoData } = activeDeckInfo;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      deckInfoPayload = {
        dbAction: deckInfoDbAction,
        data: deckInfoData,
      };
    }

    const cardsPayload: CardPayload[] = nodes
      .filter((card) => card.data.dbAction !== "none")
      .map((filteredCard) => {
        const { dbAction, ...cardData } = filteredCard.data;
        return { dbAction: dbAction, data: cardData };
      });

    // For some reason BaseLink in React flow has data field optional so i have to validate every time tha it is not undefined
    const linksToUpdate = edges.filter(
      (link) => link.data !== undefined && link.data.dbAction !== "none"
    );
    const linksPayload: LinkPayload[] = linksToUpdate
      .map((filteredLink) => {
        if (filteredLink.data) {
          const { dbAction, ...linkData } = filteredLink.data;
          return { dbAction: dbAction, data: linkData };
        }
      })
      .filter((link) => link !== undefined);

    const updateGraphPayload: UpdateGraphPayload = {
      // deckInfo: deckInfoPayload, //todo: bring this back
      cards: cardsPayload,
      links: linksPayload,
    };
    console.log("save", updateGraphPayload);
  }, []);

  // TODO: loading UI
  if (isLoadingDeck) return <h1>Loading deck</h1>;

  if (!activeDeckInfo && selectedDeck) {
    console.log(
      "PROBLEM: selectedDeckId is not defined but selectedDeck is defined"
    );
  }

  if (!activeDeckInfo || !selectedDeck) {
    return (
      <div>
        <Link to="/graphdecks">create deck</Link>
        <span> or </span>
        <label>Select a GraphDeck</label>
        <select
          defaultValue={"select-a-deck"}
          onChange={(e) => handleDeckSelection(e.target.value)}
        >
          <option value="select-a-deck" disabled>
            select a deck
          </option>
          {decksInfo?.map((deckInfo) => (
            <option key={deckInfo._id} value={deckInfo._id}>
              {deckInfo.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={styles.playGroundContainer}>
      <div className={`${styles.graphViewerContainer} `}>
        <div className={`${styles.toolBar}`}>
          <div className={`${styles.selectedDeckName}`}>
            {selectedDeck?.name}
          </div>
          <div
            className={`${styles.addCardIconContainer}`}
            onClick={() => setShowCardPanel(!showCardPanel)}
          >
            <Plus size={18} />
          </div>
          <div className={`${styles.saveIconContainer}`}>
            <Save onClick={handleSaveGraphDeck}></Save>
          </div>
        </div>
        <div ref={containerRef} className={styles.canvasContainer}>
          <ReactFlowProvider>
            <Graph />
            {/* should I just have multiple Graph component instances cached, and mke select deck switch between them */}
            {/* <TestGraph deck={selectedDeck} /> */}
          </ReactFlowProvider>
        </div>
      </div>

      {showCardPanel && selectedDeck && (
        <div className={`${styles.cardPanelContainer}`}>
          <CardPanel
            deck={selectedDeck}
            mutateDeck={mutateDeck}
            setShowCardPanel={setShowCardPanel}
          />
        </div>
      )}
    </div>
  );
}
