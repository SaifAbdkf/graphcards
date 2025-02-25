import { useEffect, useMemo, useRef, useState } from "react";
import { Edge, Network } from "vis-network";
import { Card, CardApiData } from "../Types/types";
import CardLab from "../CardLab";
import styles from "./PlaygroundPage.module.scss";
import { get } from "../services/apiService";

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [showCardLab, setShowCardLab] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    console.log("TEST RENDER PLAYGROUND");
  }, [Network]);

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

  // useEffect(() => {
  //   if (containerRef.current) {
  //     const canvas = containerRef.current.getElementsByTagName("canvas")[0];
  //     console.log(canvas);
  //     const c = canvas.getContext("2d");
  //     // c?.fillRect(50, 60, 15, 10);
  //     c?.moveTo(50, 50);

  //     c?.lineTo(400, 300);
  //     c?.stroke();
  //   }
  // }, [containerRef]);

  useEffect(() => {
    const fetchCards = async () => {
      const data: CardApiData[] = await get("/card/all");

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

  return (
    <div className={styles.playGroundContainer}>
      <div className={`${styles.cardToolBar}`}></div>
      <div className={`${styles.deckToolBarAndCanvasContainer}`}>
        <div className={`${styles.deckToolBar}`}></div>

        <div ref={containerRef} className={styles.canvasContainer}></div>
        {showCardLab && <CardLab selectedCard={selectedCard} />}
      </div>
    </div>
  );
}
