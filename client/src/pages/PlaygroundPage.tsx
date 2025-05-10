import { useCallback, useRef, useState } from "react";
import styles from "./PlaygroundPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedDeckId } from "../store/selectors/deckSelector";
import { Link } from "react-router-dom";
import CardPanel from "../constituants/CardPanel";

import { useDecksInfo } from "../hooks/useDecksInfo";
import { useDeck } from "../hooks/useDeck";
import Graph from "../constituants/Graph";
import { setSelectedDeckId } from "../store/slices/deckSlice";
import { Plus } from "lucide-react";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedDeckId = useSelector(selectSelectedDeckId);
  const { data: activeDeck } = useDeck(selectedDeckId);

  const [showCardPanel, setShowCardPanel] = useState<boolean>(false);

  const dispatch = useDispatch();

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
  } = useDeck(selectedDeckId);

  console.log("selected deck ---", selectedDeck);
  const handleDeckSelection = useCallback(
    (deckId: string) => {
      dispatch(setSelectedDeckId(deckId));
    },
    [dispatch]
  );

  // TODO: loading UI
  if (isLoadingDeck) return <h1>Loading deck</h1>;

  if (!selectedDeckId && selectedDeck) {
    console.log(
      "PROBLEM: selectedDeckId is not defined but selectedDeck is defined"
    );
  }

  if (!selectedDeckId || !selectedDeck) {
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
          <div className={`${styles.selectedDeckName}`}>{activeDeck?.name}</div>
          {/*<SelectRelatedCards
            cards={[]}
            handleSelectRelatedCard={function (cardId: string): void {
              throw new Error("Function not implemented.");
            }}
          /> */}
          <div
            className={`${styles.addCardIconContainer}`}
            onClick={() => setShowCardPanel(!showCardPanel)}
          >
            <Plus size={18} />
          </div>
        </div>
        <div ref={containerRef} className={styles.canvasContainer}>
          <Graph deck={selectedDeck} />
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
