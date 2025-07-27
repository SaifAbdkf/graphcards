import { DeckInfo } from "../Types/appDataTypes";
import styles from "./DisplayDeckInfo.module.scss";

export function DisplayDeckInfo({ deckInfo }: { deckInfo: DeckInfo }) {
  return (
    <div className={`${styles.DisplayDeckInfoContainer}`}>
      <div className={`${styles.deckNameContainer}`}>{deckInfo.name}</div>
      <div className={`${styles.deckDecriptionContainer}`}>
        {deckInfo.description}
      </div>
    </div>
  );
}
