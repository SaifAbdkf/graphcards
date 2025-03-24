import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

export default function Graph3() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Define Nodes
    const nodes = [
      {
        id: 1,
        label: "Card 1",
        moreInfo:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      },
      {
        id: 2,
        label: "Card 2",
        moreInfo:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      },
      {
        id: 3,
        label: "Card 3",
        moreInfo:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      },
      {
        id: 4,
        label: "Card 4",
        moreInfo:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      },
    ];

    // Define Edges (connections)
    const edges = [
      { id: 10, from: 1, to: 2 },
      { id: 20, from: 2, to: 1 },
      { id: 11, from: 1, to: 3 },
      { id: 12, from: 2, to: 4 },
    ];

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
  }, []);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
