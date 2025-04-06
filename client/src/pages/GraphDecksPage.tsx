import "@szhsin/react-menu/dist/core.css";
import "../constituants/DeckMenu.scss";

import styles from "./GraphDecksPage.module.scss";

import AddDeck from "../constituants/AddDeck";
import Deck from "../constituants/Deck";
import { useDecksInfo } from "../hooks/useDecksInfo";

export default function GraphDecksPage() {
  console.log("GraphDecksPage rendering");

  const { data: decksInfo, error, isLoading } = useDecksInfo();

  console.log("graphdeckspages", decksInfo);
  return (
    <div className={styles.decksPageContainer}>
      <h1>My GraphDecks</h1>
      <div className={styles.decksList}>
        <AddDeck />
        {decksInfo?.map((deckInfo) => (
          <Deck key={deckInfo._id} deckInfo={deckInfo} />
        ))}
      </div>
    </div>
  );
}
