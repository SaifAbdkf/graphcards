import "@szhsin/react-menu/dist/core.css";
import "../constituants/DeckMenu.scss";

import styles from "./GraphDecksPage.module.scss";

import Deck from "../constituants/Deck";
import { useDecksInfo } from "../hooks/useDecksInfo";
import CreateDeck from "../constituants/CreateDeck";

export default function GraphDecksPage() {
  const { data: decksInfo } = useDecksInfo();

  return (
    <div className={styles.decksPageContainer}>
      <h1>My GraphDecks</h1>
      <div className={styles.decksList}>
        <CreateDeck />
        {decksInfo?.map((deckInfo) => (
          <Deck key={deckInfo._id} deckInfo={deckInfo} />
        ))}
      </div>
    </div>
  );
}
