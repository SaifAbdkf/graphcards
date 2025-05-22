import "@xyflow/react/dist/style.css";
import { GraphcardsState, Deck } from "../Types/types";
import { ConnectionMode, Controls, ReactFlow, Node } from "@xyflow/react";
import { CardNode } from "./CardNode";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import LinkEdge from "./LinkEdge";

// type CustomEdge = ReactFlowEdge & {
//   type: "cardEdge";
//   data: LinkFields;
// };

const nodeTypes = {
  cardNode: CardNode,
};

const edgeTypes = {
  LinkEdge: LinkEdge,
};

const ReactFlowDataSelector = (state: GraphcardsState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function Graph({ dbDeck }: { dbDeck: Deck }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useGraphcardStore(useShallow(ReactFlowDataSelector));

  console.log("edges are ", edges);
  console.log("graph rendering", dbDeck);
  const dbCards: Node[] = dbDeck.cards.map((card, index) => ({
    id: card._id,
    type: "cardNode",
    data: { front: card.front, back: card.back },
    position: { x: index * 100, y: 100 },
  }));

  // const dbEdges: CustomEdge[] = dbDeck.links.map((edge) => ({
  //   id: edge._id,
  //   source: edge.from,
  //   target: edge.to,
  //   type: "cardEdge",
  //   data: edge,
  // }));

  // separation between dbDeck and browserDeck
  // const [browserNodes, setBrowserNodes] = useState<Node[]>(dbCards);
  //
  // const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>(dbEdges);

  // const onConnect = useCallback(
  //   (connection: Connection) => {
  //     const newEdge: CustomEdge = {
  //       ...connection,
  //       type: "cardEdge",
  //       id: `${connection.source}-${
  //         connection.target
  //       }-${Date.now().toString()}`,
  //       data: {
  //         isDirected: true,
  //         from: connection.source!,
  //         to: connection.target!,
  //       },
  //     };
  //     setEdges((eds) => addEdge(newEdge, eds));
  //   },
  //   [setEdges]
  // );

  const handleClick = () => {
    console.log("asba");
  };

  return (
    <>
      <button onClick={handleClick}>test action</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
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
