import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import styles from "./GraphDecksPage.module.scss";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { createDeck, getDeck, getDecksInfo } from "../services/api/decksApi";
import { setCurrentDeck, setDecksInfo } from "../store/slices/deckSlice";
import { dummy } from "../utils/utils";
import { DeckFields, emptyDeckFields } from "../Types/types";
import { useNavigate } from "react-router-dom";
import {
  selectCurrentDeck,
  selectDecksInfo,
} from "../store/selectors/deckSelector";

export default function GraphDecksPage() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);
  const [deckFields, setDeckFields] = useState<DeckFields>(emptyDeckFields);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const decksInfo = useSelector(selectDecksInfo);
  const currentDeck = useSelector(selectCurrentDeck);
  console.log("decks info!!", decksInfo, "currDeck", currentDeck);

  useEffect(() => {
    const fetchDecksInfo = async () => {
      console.log("fetching decks!!!!!!");
      const fetchedDecksInfo = await getDecksInfo();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    fetchDecksInfo();
  }, [dispatch]);

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newDeckFields = { ...deckFields };
      switch (name) {
        case "deckName":
          newDeckFields.name = value;
          setDeckFields(newDeckFields);
          break;
        case "deckDescription":
          newDeckFields.description = value;
          setDeckFields(newDeckFields);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [deckFields]
  );

  const handleBuildGraph = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const triggerCreateDeck = async () => {
      const createdDeck = await createDeck(deckFields);
      if (createdDeck) {
        dispatch(setCurrentDeck(createdDeck));
        navigate("/playground");
      }
    };

    triggerCreateDeck();
  };

  const handleDeckClick = useCallback(
    (deckId: string) => {
      const fetchDeck = async () => {
        const selectedDeck = await getDeck(deckId);
        console.log("selectedDeck is, ", selectedDeck);
        dispatch(setCurrentDeck(selectedDeck));
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
            <span>create a new GraphDeck</span>
          </div>
        ) : (
          <div
            className={`${styles.deckRepresentation} ${styles.addDeck}  ${styles.addDeckNoHover}`}
          >
            <div className={`${styles.formContainer} ${styles.jumpAnimation}`}>
              <div>
                <input
                  placeholder={"name"}
                  name="deckName"
                  className={styles.deckName}
                  value={deckFields.name}
                  onChange={handleFieldChange}
                ></input>
              </div>
              <div>
                <textarea
                  placeholder={"decsription"}
                  name={"deckDescription"}
                  className={styles.deckDescription}
                  value={deckFields.description}
                  onChange={handleFieldChange}
                ></textarea>
              </div>
              <div className={styles.buttonsContainer}>
                <div className={styles.generateButtonContainer}>
                  <Button
                    bgColorClass="bg-neutral"
                    fontSizeClass="small-font-size"
                    onClick={dummy}
                  >
                    Generate graph from file (gpt logo)
                  </Button>
                </div>
                <div>or </div>
                <div className={styles.scratchButtonContainer}>
                  <Button
                    bgColorClass="bg-neutral"
                    fontSizeClass="small-font-size"
                    onClick={handleBuildGraph}
                  >
                    add card
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {decksInfo?.map((deckInfo) => (
          <>
            <div
              key={deckInfo.name}
              className={styles.deckRepresentation}
              onClick={() => handleDeckClick(deckInfo._id)}
            >
              <div>{deckInfo.name}</div>
              <div>{deckInfo.description}</div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
