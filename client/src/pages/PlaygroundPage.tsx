import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "../Types/types";
import styles from "./PlaygroundPage.module.scss";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveDeck,
  selectDecksInfo,
} from "../store/selectors/deckSelector";
import { setActiveDeck, setDecksInfo } from "../store/slices/deckSlice";
import { Link, useNavigate } from "react-router-dom";
import CardPanel from "../constituants/CardPanel";
import { getMultipleRequest } from "../services/api/apiRequestMethods";
import { getDeckRequest, getDecksInfoRequest } from "../services/api/decksApi";

import Graph3 from "../constituants/Graph3";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showCardPanel, setShowCardPanel] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const decksInfo = useSelector(selectDecksInfo);
  const activeDeck = useSelector(selectActiveDeck);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecksInfo = async () => {
      const fetchedDecksInfo = await getDecksInfoRequest();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    if (decksInfo.length === 0) {
      fetchDecksInfo();
    }
  }, [decksInfo, dispatch]);

  useEffect(() => {
    const fetchCards = async () => {
      const data: CardApiData[] = await getMultipleRequest("/card/all");

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
        const selectedDeck = await getDeckRequest(deckId);
        dispatch(setActiveDeck(selectedDeck));
        navigate("/playground");
      };
      fetchAndSelectDeck();
    },
    [dispatch, navigate]
  );

  if (!activeDeck) {
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
            <option key={deckInfo._id} value={deckInfo._id}>
              {deckInfo.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={styles.playGroundContainer}>
      <div className={`${styles.graphViewerContainer} `}>
        <div className={`${styles.graphViewerBar}`}>
          <div className={`${styles.selectedDeckName}`}>{activeDeck?.name}</div>
          <Button
            bgColorClass="bg-green"
            onClick={() => setShowCardPanel(!showCardPanel)}
          >
            add card
          </Button>
        </div>
        <div ref={containerRef} className={styles.canvasContainer}>
          <Graph3 />
        </div>
      </div>

      {showCardPanel && (
        <div className={`${styles.cardPanelContainer}`}>
          <CardPanel
            selectedCard={selectedCard}
            setShowCardPanel={setShowCardPanel}
          />
        </div>
      )}
    </div>
  );
}
