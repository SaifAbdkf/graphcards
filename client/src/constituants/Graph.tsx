import "@xyflow/react/dist/style.css";
import { Deck } from "../Types/types";
import {
  addEdge,
  Connection,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback } from "react";
import { CardNode } from "./CardNode";

const nodeTypes = {
  cardNode: CardNode,
};

export default function Graph({ deck }: { deck: Deck }) {
  const initialNodes = deck.cards.map((card, index) => ({
    id: card._id,
    type: "cardNode",
    data: { front: card.front, back: card.back },
    position: { x: index * 100, y: 100 },
  }));

  const initialEdges = deck.edges.map((edge) => ({
    id: edge._id,
    source: edge.from,
    target: edge.to,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = { ...connection, animated: true };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleClick = () => {
    console.log("asba");
  };

  return (
    <>
      <button onClick={handleClick}>test action</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={"loose"}
      >
        <Controls />
      </ReactFlow>
    </>
  );
}
