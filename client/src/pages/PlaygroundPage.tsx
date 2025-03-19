import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../Types/types";
import CardLab from "../components/CardLab";
import styles from "./PlaygroundPage.module.scss";
import { getMultiple } from "../services/api/apiRequestMethods";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentDeck,
  selectDecksInfo,
} from "../store/selectors/deckSelector";
import { setCurrentDeck, setDecksInfo } from "../store/slices/deckSlice";
import { getDeck, getDecksInfo } from "../services/api/decksApi";
import { Link, useNavigate } from "react-router-dom";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showCardLab, setShowCardLab] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const decksInfo = useSelector(selectDecksInfo);
  const currentDeck = useSelector(selectCurrentDeck);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecksInfo = async () => {
      const fetchedDecksInfo = await getDecksInfo();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    if (decksInfo === null) {
      fetchDecksInfo();
    }
  }, [decksInfo, dispatch]);

  useEffect(() => {
    const fetchCards = async () => {
      const data: CardApiData[] = await getMultiple("/card/all");

      const formattedCards: Card[] = data.map((card) => ({
        ...card,
        id: card._id,
        _id: undefined,
      }));
      setCards(formattedCards);
    };

    fetchCards();
  }, []);

  const handleDeckSelection = useCallback(
    (deckId: string) => {
      const fetchAndSelectDeck = async () => {
        const selectedDeck = await getDeck(deckId);
        dispatch(setCurrentDeck(selectedDeck));
        navigate("/playground");
      };
      fetchAndSelectDeck();
    },
    [dispatch, navigate]
  );

  if (!currentDeck) {
    return (
      <div>
        <Link to="/graphdecks">create deck</Link>
        <span> or </span>
        <label>Select a GraphDeck</label>
        <select
          defaultValue={"select-a-deck"}
          onChange={(e) => handleDeckSelection(e.target.value)}
        >
          <option value="select-a-deck" disabled>
            select a deck
          </option>
          {decksInfo?.map((deckInfo) => (
            <option value={deckInfo._id}>{deckInfo.name}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={styles.playGroundContainer}>
      <div className={`${styles.graphViewerContainer} `}>
        <div className={`${styles.graphViewerBar}`}>
          <div>
            <span>{currentDeck?.name}</span>
          </div>
          <Button
            bgColorClass="bg-green"
            onClick={() => setShowCardLab(!showCardLab)}
          >
            add card
          </Button>
        </div>
        <div ref={containerRef} className={styles.canvasContainer}>
          {/* simple clean black borderline separation */}
        </div>
      </div>

      {showCardLab && (
        <div className={`${styles.cardLabContainer}`}>
          <CardLab cardToEdit={selectedCard} setShowCardLab={setShowCardLab} />
        </div>
      )}
    </div>
  );
}
