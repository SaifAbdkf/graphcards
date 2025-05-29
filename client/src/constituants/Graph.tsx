import "@xyflow/react/dist/style.css";
import { GraphcardsState } from "../Types/types";
import { ConnectionMode, Controls, ReactFlow } from "@xyflow/react";
import { CardNode } from "./CardNode";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import LinkEdge from "./LinkEdge";

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

export default function Graph() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useGraphcardStore(useShallow(ReactFlowDataSelector));

  const createCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // const emptyCardNode: CardNode = {
    //   id: `temp-${Date.now()}`,
    //   position: {

    //   }
    // };
    console.log("double click");
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        // onNodeDoubleClick={()}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        onDoubleClick={(event) => createCard(event)}
      >
        <Controls />
      </ReactFlow>
    </>
  );
}
