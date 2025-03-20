import { useDispatch, useSelector } from "react-redux";
import styles from "./GraphDecksPage.module.scss";
import { useCallback, useEffect, useState } from "react";
import { getDeck, getDecksInfo } from "../services/api/decksApi";
import { setActiveDeck, setDecksInfo } from "../store/slices/deckSlice";

import { useNavigate } from "react-router-dom";
import {
  selectActiveDeck,
  selectDecksInfo,
} from "../store/selectors/deckSelector";
import CreateDeckForm from "../components/CreateDeckForm";

export default function GraphDecksPage() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const decksInfo = useSelector(selectDecksInfo);
  // TODO: special effect to selected deck
  const activeDeck = useSelector(selectActiveDeck);

  useEffect(() => {
    const fetchDecksInfo = async () => {
      const fetchedDecksInfo = await getDecksInfo();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    fetchDecksInfo();
  }, [dispatch]);

  const handleDeckClick = useCallback(
    (deckId: string) => {
      const fetchDeck = async () => {
        const selectedDeck = await getDeck(deckId);
        dispatch(setActiveDeck(selectedDeck));
        navigate("/playground");
      };
      fetchDeck();
    },
    [navigate]
  );

  return (
    <div className={styles.decksPageContainer}>
      <h1>My GraphDecks</h1>

      <div className={styles.decksList}>
        <div
          onClick={() => setCreateDeckMode(true)}
          key="add-decks"
          className={`${styles.deckRepresentation} ${styles.addDeck} ${
            createDeckMode && styles.addDeckNoHover
          }`}
        >
          <div className={`${styles.scrollableDeckContent}`}>
            {!createDeckMode ? (
              <>
                <div>Create </div>
                <div>GraphDeck</div>
              </>
            ) : (
              <CreateDeckForm />
            )}
          </div>
        </div>

        {decksInfo?.map((deckInfo) => (
          <div
            key={deckInfo.name}
            className={styles.deckRepresentation}
            onClick={() => handleDeckClick(deckInfo._id)}
          >
            <div className={`${styles.deckInfoContainer}`}>{deckInfo.name}</div>
            <div className={`${styles.deckDecriptionContainer}`}>
              {deckInfo.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
