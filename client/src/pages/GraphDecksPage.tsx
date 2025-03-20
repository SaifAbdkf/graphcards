import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import styles from "./GraphDecksPage.module.scss";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { createDeck, getDeck, getDecksInfo } from "../services/api/decksApi";
import { setActiveDeck, setDecksInfo } from "../store/slices/deckSlice";
import { dummy } from "../utils/utils";
import {
  DeckBasicFields,
  DeckFields,
  emptyDeckBasicFields,
} from "../Types/types";
import { useNavigate } from "react-router-dom";
import {
  selectActiveDeck,
  selectDecksInfo,
} from "../store/selectors/deckSelector";

export default function GraphDecksPage() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);
  const [deckBasicFields, setDeckBasicFields] =
    useState<DeckBasicFields>(emptyDeckBasicFields);
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

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newDeckFieldsBasic = { ...deckBasicFields };
      switch (name) {
        case "deckName":
          newDeckFieldsBasic.name = value;
          setDeckBasicFields(newDeckFieldsBasic);
          break;
        case "deckDescription":
          newDeckFieldsBasic.description = value;
          setDeckBasicFields(newDeckFieldsBasic);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [deckBasicFields]
  );

  const handleBuildGraph = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const triggerCreateDeck = async () => {
      const deckFields: DeckFields = {
        ...deckBasicFields,
        cards: [],
      };
      const createdDeck = await createDeck(deckFields);
      if (createdDeck) {
        dispatch(setActiveDeck(createdDeck));
        navigate("/playground");
      }
    };

    triggerCreateDeck();
  };

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
        {!createDeckMode ? (
          <div
            onClick={() => setCreateDeckMode(true)}
            className={`${styles.deckRepresentation} ${styles.addDeck}`}
          >
            <div>Create</div>
            <div>a New</div>
            <div>GraphDeck</div>
          </div>
        ) : (
          <CreateDeckForm />
        )}
        {decksInfo?.map((deckInfo) => (
          <>
            <div
              key={deckInfo.name}
              className={styles.deckRepresentation}
              onClick={() => handleDeckClick(deckInfo._id)}
            >
              <div className={`${styles.deckInfoContainer}`}>
                {deckInfo.name}
              </div>
              <div className={`${styles.deckDecriptionContainer}`}>
                {deckInfo.description}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
