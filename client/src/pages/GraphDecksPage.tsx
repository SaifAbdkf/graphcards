import "@szhsin/react-menu/dist/core.css";
import "../constituants/DeckMenu.scss";

import styles from "./GraphDecksPage.module.scss";

import Deck from "../constituants/Deck";
import CreateDeck from "../constituants/CreateDeck";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export default function GraphDecksPage() {
  const decksInfo = useGraphcardsStore(useShallow((state) => state.decksInfo));
  return (
    <div className={styles.decksPageContainer}>
      <div className={styles.decksList}>
        <CreateDeck />
        {decksInfo?.map((deckInfo) => (
          <Deck key={deckInfo._id} deckInfo={deckInfo} />
        ))}
      </div>
    </div>
  );
}
