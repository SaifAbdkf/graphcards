import { useNavigate } from "react-router-dom";
import { DeckInfo } from "../Types/appDataTypes";
import styles from "./DisplayDeckInfo.module.scss";
import { useCallback } from "react";
import { useTestDeck } from "../store/testSlice";

export function DisplayDeckInfo({ deckInfo }: { deckInfo: DeckInfo }) {
  const navigate = useNavigate();
  const { setTestingDeckId } = useTestDeck();

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
      <button onClick={startTest}>test</button>
    </div>
  );
}
