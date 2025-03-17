import { useEffect, useMemo, useRef, useState } from "react";
import { Edge, Network } from "vis-network";
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
import { setDecksInfo } from "../store/slices/deckSlice";
import { getDecksInfo } from "../services/api/decksApi";
import { Link } from "react-router-dom";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [showCardLab, setShowCardLab] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const decksInfo = useSelector(selectDecksInfo);
  const currentDeck = useSelector(selectCurrentDeck);
  console.log("playground current deck is", currentDeck);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDecksInfo = async () => {
      console.log("fetching decks!!!!!!");
      const fetchedDecksInfo = await getDecksInfo();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    if (decksInfo === null) {
      fetchDecksInfo();
    }
  }, [decksInfo, dispatch]);

  const nodes: Node[] = useMemo(
    () =>
      cards.map((card) => ({
        id: card.id,

        shape: "custom",
        ctxRenderer: ({
          ctx,
          x,
          y,
          id,
          state: { selected: selected, hover: hover },
        }) => {
          // const width = 120;
          // const height = 60;

          ctx.fillStyle = hover ? "#ddd" : "#f0f0f0";

          const drawRect = (width, height, selected) => {
            ctx.fillRect(x - width / 2, y - height / 2, width, height);

            ctx.strokeStyle = selected ? "#ff0000" : "#333";
            ctx.strokeRect(x - width / 2, y - height / 2, width, height);

            ctx.fillStyle = "#000";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(card.front.value, x, y - 10);
            ctx.fillText(card.back.example, x, y + 5);
            // ctx.fillText(
            //   "the quick brown fox jumped over the lazy dog",
            //   x,
            //   y - 20
            // );
          };

          if (selected) {
            drawRect(30, 30);
          } else {
            drawRect(120, 60);
          }

          return { drawExternal: false };
        },
      })),
    [cards]
  );

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

  useEffect(() => {
    const edges: Edge[] = [];

    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.8,
        },
      },
      interaction: {
        hover: true,
      },
      nodes: { shape: "box" },
    };
    if (containerRef.current !== null) {
      setNetwork(new Network(containerRef.current, data, options));
    }

    if (network) {
      return () => network.destroy();
    }
  }, [nodes]);

  useEffect(() => {
    if (!network) return;

    const handleGraphClick = () => {
      const selectedNodes = network.getSelectedNodes();
      if (cards) {
        const selected = cards.find((card) => card.id === selectedNodes[0]);
        if (selected) {
          setSelectedCard(selected);
          setShowCardLab(true);
          console.log(network.getBoundingBox(selected.id));
        } else {
          setSelectedCard(null);
          setShowCardLab(false);
        }
      }
    };
    network?.on("click", handleGraphClick);

    return () => network.off("selectNode", handleGraphClick);
  }, [network, cards]);

  if (!currentDeck) {
    return (
      <div>
        <Link to="/graphsdecks">create deck</Link> or select deck
      </div>
    );
  }

  return (
    <div className={styles.playGroundContainer}>
      <div ref={containerRef} className={styles.canvasContainer}></div>
      <div className={`${styles.deckToolBar}`}>
        <div>
          <label>(graphDeck icon)</label>
          <span>{currentDeck?.name}</span>
        </div>
      </div>
      <div className={`${styles.cardToolBar}`}>
        <Button bgColorClass="bg-green" onClick={() => setShowCardLab(true)}>
          +
        </Button>
      </div>
      {showCardLab && (
        <CardLab cardToEdit={selectedCard} setShowCardLab={setShowCardLab} />
      )}
    </div>
  );
}
