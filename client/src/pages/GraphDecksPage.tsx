import { useDispatch, useSelector } from "react-redux";
import "@szhsin/react-menu/dist/core.css";
import "../constituants/DeckMenu.scss";

import styles from "./GraphDecksPage.module.scss";
import { useEffect } from "react";
import { setDecksInfo } from "../store/slices/deckSlice";

import { selectDecksInfo } from "../store/selectors/deckSelector";
import { getDecksInfoRequest } from "../services/api/decksApi";
import AddDeck from "../constituants/AddDeck";
import Deck from "../constituants/Deck";

export default function GraphDecksPage() {
  console.log("GraphDecksPage rendering");

  const dispatch = useDispatch();

  const decksInfo = useSelector(selectDecksInfo);
  // TODO: special effect to selected deck
  // const activeDeck = useSelector(selectActiveDeck);

  useEffect(() => {
    const fetchDecksInfo = async () => {
      const fetchedDecksInfo = await getDecksInfoRequest();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    fetchDecksInfo();
  }, [dispatch]);

  return (
    <div className={styles.decksPageContainer}>
      <h1>My GraphDecks</h1>
      <div className={styles.decksList}>
        <AddDeck />
        {decksInfo?.map((deckInfo) => (
          <Deck deckInfo={deckInfo} />
        ))}
      </div>
    </div>
  );
}
