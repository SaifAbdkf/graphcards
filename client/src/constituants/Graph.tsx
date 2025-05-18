import "@xyflow/react/dist/style.css";
import { Deck, LinkFields } from "../Types/types";
import {
  addEdge,
  Connection,
  ConnectionMode,
  Controls,
  Edge as ReactFlowEdge,
  ReactFlow,
  useEdgesState,
  Node,
} from "@xyflow/react";
import { useCallback } from "react";
import { CardNode } from "./CardNode";
import CardEdge from "./CardEdge";

type CustomEdge = ReactFlowEdge & {
  type: "cardEdge";
  data: LinkFields;
};

const nodeTypes = {
  cardNode: CardNode,
};

const edgeTypes = {
  cardEdge: CardEdge,
};

export default function Graph({ dbDeck }: { dbDeck: Deck }) {
  console.log("graph rendering", dbDeck);
  const dbCards: Node[] = dbDeck.cards.map((card, index) => ({
    id: card._id,
    type: "cardNode",
    data: { front: card.front, back: card.back },
    position: { x: index * 100, y: 100 },
  }));

  const dbEdges: CustomEdge[] = dbDeck.links.map((edge) => ({
    id: edge._id,
    source: edge.from,
    target: edge.to,
    type: "cardEdge",
    data: edge,
  }));
  console.log("initial nodes: ", dbCards);

  // separation between dbDeck and browserDeck
  // const [browserNodes, setBrowserNodes] = useState<Node[]>(dbCards);
  //
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>(dbEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: CustomEdge = {
        ...connection,
        type: "cardEdge",
        id: `${connection.source}-${
          connection.target
        }-${Date.now().toString()}`,
        data: {
          isDirected: true,
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
        nodes={dbCards}
        edges={edges}
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
