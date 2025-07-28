import "@szhsin/react-menu/dist/core.css";

import styles from "./GraphDecksPage.module.scss";

import CreateDeck from "../components/CreateDeck";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import DeckFrame from "../components/DeckFrame";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../DB/db";

export default function GraphDecksPage() {
  const deckInfoDX = useLiveQuery(() => db.DeckInfo.toArray());
  console.log(deckInfoDX);

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
