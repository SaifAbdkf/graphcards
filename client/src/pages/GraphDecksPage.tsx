import "@szhsin/react-menu/dist/core.css";

import styles from "./GraphDecksPage.module.scss";

import CreateDeck from "../components/CreateDeck";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import DeckFrame from "../components/DeckFrame";

export default function GraphDecksPage() {
  const decksInfo = useGraphcardsStore(useShallow((state) => state.decksInfo));
  return (
    <div className={styles.decksList}>
      <CreateDeck />
      {decksInfo?.map((deckInfo) => (
        <>
          <DeckFrame key={deckInfo._id} deckInfo={deckInfo} />
        </>
      ))}
    </div>
  );
}
