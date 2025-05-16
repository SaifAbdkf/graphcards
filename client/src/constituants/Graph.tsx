import "@xyflow/react/dist/style.css";
import { Deck } from "../Types/types";
import {
  addEdge,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback } from "react";
import { CardNode } from "./CardNode";
import CardEdge from "./CardEdge";

type EdgeData = {
  _id: string;
  from: string;
  to: string;
};

type CustomEdge = Edge & {
  type: "cardEdge";
  data: EdgeData;
};

const nodeTypes = {
  cardNode: CardNode,
};

const edgeTypes = {
  cardEdge: CardEdge,
};

export default function Graph({ deck }: { deck: Deck }) {
  const initialNodes = deck.cards.map((card, index) => ({
    id: card._id,
    type: "cardNode",
    data: { front: card.front, back: card.back },
    position: { x: index * 100, y: 100 },
  }));

  const initialEdges: CustomEdge[] = deck.edges.map((edge) => ({
    id: edge._id,
    source: edge.from,
    target: edge.to,
    type: "cardEdge",
    data: edge,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdge>(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: CustomEdge = {
        ...connection,
        type: "cardEdge",
        id: `${connection.source}-${connection.target}`,
        data: {
          _id: `${connection.source}-${connection.target}`,
          from: connection.source!,
          to: connection.target!,
        },
      };
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
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
      </ReactFlow>
    </>
  );
}
