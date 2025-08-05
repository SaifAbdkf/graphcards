import { useNavigate } from "react-router-dom";
import { DeckInfo } from "../Types/appDataTypes";
import styles from "./DisplayDeckInfo.module.scss";
import { useCallback } from "react";
import { useTestDeck } from "../store/testSlice";
import { useActiveDeckInfo } from "../store/graphdecksDataSlice";
import { useLabView } from "../store/UISlice";

export function DisplayDeckInfo({
  deckInfo,
  isSelected,
}: {
  deckInfo: DeckInfo;
  isSelected: boolean;
}) {
  const navigate = useNavigate();
  const { setTestingDeckId } = useTestDeck();
  const { setActiveDeckInfo } = useActiveDeckInfo();
  const { setLabView } = useLabView();

  const openDeck = () => {
    setActiveDeckInfo(deckInfo);
    setLabView("activeDeck");
    navigate(`/lab/${deckInfo._id}`);
  };

  const startTest = useCallback(() => {
    setTestingDeckId(deckInfo._id);
    navigate(`/lab/test/${deckInfo._id}`);
  }, [deckInfo._id, navigate, setTestingDeckId]);

  return (
    <div className={`${styles.DisplayDeckInfoContainer}`}>
      <div className={`${styles.deckNameContainer}`}>{deckInfo.name}</div>
      <div className={`${styles.deckDecriptionContainer}`}>
        {deckInfo.description}
      </div>
      {isSelected && (
        <div className={`${styles.deckOptionsContainer}`}>
          <button onClick={openDeck} className={`${styles.button}`}>
            open
          </button>
          <button onClick={startTest} className={`${styles.button}`}>
            test
          </button>
        </div>
      )}
    </div>
  );
}
