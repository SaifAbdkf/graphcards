import { useEffect, useRef } from "react";
import { Edge, Network, Node } from "vis-network";
import "vis-network/styles/vis-network.css";
import { Deck } from "../Types/types";

export default function Graph({ deck }: { deck: Deck }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !deck) return;
    const nodes: Node[] = deck.cards.map((card) => ({
      id: card._id,
      label: card.front,
    }));

    const edges: Edge[] = deck.edges.map((edge) => ({
      id: edge._id,
      from: edge.from,
      to: edge.to,
    }));

    // Create the network
    const network = new Network(
      containerRef.current,
      { nodes, edges },
      {
        nodes: {
          shape: "box", // Makes nodes look like cards
          margin: 10,
          color: {
            background: "#f0f0f0",
            border: "#333",
          },
          font: { color: "#000" },
        },
        edges: {
          color: "#848484",
          arrows: { to: true },
        },
        physics: {
          enabled: true, // Enable force-directed layout
        },
      }
    );

    return () => network.destroy();
  }, [deck]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
