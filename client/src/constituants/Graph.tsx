import "@xyflow/react/dist/style.css";
import { CardNode, GraphcardsState } from "../Types/types";
import {
  ConnectionMode,
  Controls,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { CardNodeComponent } from "./CardNodeComponent";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import LinkEdge from "./LinkEdge";
import { useCallback, useState } from "react";

const nodeTypes = {
  cardNode: CardNodeComponent,
};

const edgeTypes = {
  LinkEdge: LinkEdge,
};

const ReactFlowDataSelector = (state: GraphcardsState) => ({
  activeDeckInfo: state.activeDeckInfo,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  setNodeEditMode: state.setNodeEditMode,
});

export default function Graph() {
  const [currentlyEditingCard, setcurrentlyEditingCard] =
    useState<CardNode | null>(null);
  const {
    activeDeckInfo,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodeEditMode,
  } = useGraphcardStore(useShallow(ReactFlowDataSelector));
  const { screenToFlowPosition } = useReactFlow();
  console.log("nodes are ", nodes);
  const createCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("double click - create card fuction");
    if (!activeDeckInfo) throw Error("aciveDeckInfo should not be undefined");
    const { clientX, clientY } = event;

    const { x: graphX, y: graphY } = screenToFlowPosition({
      x: clientX,
      y: clientY,
    });

    const cardTempId = `temp-${Date.now()}`;
    const emptyCardNode: CardNode = {
      id: cardTempId,
      type: "cardNode",
      selected: true,
      position: {
        x: graphX,
        y: graphY,
      },
      data: {
        dbAction: "create",
        editMode: true,
        _id: cardTempId,
        deckId: activeDeckInfo?._id,
        x: graphX,
        y: graphY,
        front: "",
        back: "",
      },
    };
    setcurrentlyEditingCard(emptyCardNode);
    addNode(emptyCardNode);
  };

  const doubleClickCard = (
    event: React.MouseEvent<Element, MouseEvent>,
    node: CardNode
  ) => {
    console.log("card double click event");
    event.stopPropagation();
    setNodeEditMode(node, true);
    setcurrentlyEditingCard(node);
  };

  const setCardEditModeOff = useCallback(() => {
    console.log("paneclick triggered setCardEditModeOff");
    if (currentlyEditingCard) {
      setNodeEditMode(currentlyEditingCard, false);
      setcurrentlyEditingCard(null);
    }
  }, [currentlyEditingCard, setNodeEditMode]);

  const maybeSetCardEditModeOff = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, node: CardNode) => {
      console.log("card click triggered maybesetCardeditmodeoff");
      e.stopPropagation();
      if (currentlyEditingCard && currentlyEditingCard.id !== node.id) {
        setcurrentlyEditingCard(null);
        setNodeEditMode(currentlyEditingCard, false);
      }
    },
    [currentlyEditingCard, setNodeEditMode]
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        onNodeClick={(event, node) => maybeSetCardEditModeOff(event, node)}
        onDoubleClick={(event) => createCard(event)}
        onNodeDoubleClick={(event, node) => doubleClickCard(event, node)}
        onPaneClick={setCardEditModeOff}
      >
        <Controls />
      </ReactFlow>
    </>
  );
}
