import "@xyflow/react/dist/style.css";
import { CardNode, LinkEdge } from "../Types/appDataTypes";
import {
  ConnectionMode,
  Controls,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { CardNodeComponent } from "./CardNodeComponent";
import { GraphcardsStoreState, useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { useCallback, useRef, useState } from "react";
import LinkEdgeComponent from "./LinkEdgeComponent";
import styles from "./ActiveGraphDeck.module.scss";
import { ObjectId } from "bson";
const nodeTypes = {
  cardNode: CardNodeComponent,
};

const edgeTypes = {
  LinkEdge: LinkEdgeComponent,
};

const ReactFlowDataSelector = (state: GraphcardsStoreState) => ({
  activeDeckInfo: state.activeDeckInfo,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  setNodeEditMode: state.setNodeEditMode,
  setEdgeEditMode: state.setEdgeEditMode,
});

export default function ActiveGraphDeck() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentlyEditingCardId, setcurrentlyEditingCardId] = useState<
    string | null
  >(null);

  const {
    activeDeckInfo,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodeEditMode,
    setEdgeEditMode,
  } = useGraphcardsStore(useShallow(ReactFlowDataSelector));
  console.log("nodes are ", nodes);

  const { screenToFlowPosition } = useReactFlow();

  // const { setViewport } = useReactFlow();
  // const { x: currX, y: currY, zoom: currZ } = useViewport();
  // console.log({ x: currX, y: currY, zoom: currZ });

  // const handleAnimate = () => {
  //   animateViewport(
  //     setViewport,
  //     { x: currX, y: currY, zoom: currZ },
  //     { x: 100, y: 100, zoom: 1.5 },
  //     800
  //   );
  // };

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;

    const { x: graphX, y: graphY } = screenToFlowPosition({
      x: clientX,
      y: clientY,
    });

    console.log({ click_X: graphX, click_Y: graphY });
  };
  const createCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!activeDeckInfo) {
      console.error("aciveDeckInfo should not be undefined");
      return;
    }
    const { clientX, clientY } = event;

    const { x: graphX, y: graphY } = screenToFlowPosition({
      x: clientX,
      y: clientY,
    });

    const newCardId = new ObjectId().toHexString();
    const emptyCardNode: CardNode = {
      id: newCardId,
      type: "cardNode",
      selected: true,
      position: {
        x: graphX,
        y: graphY,
      },
      data: {
        dbAction: "create",
        editMode: true,
        _id: newCardId,
        deckId: activeDeckInfo?._id,
        x: graphX,
        y: graphY,
        front: "",
        back: "",
        leitnerBox: 1,
      },
    };
    setcurrentlyEditingCardId(emptyCardNode.id);
    addNode(emptyCardNode);
  };

  const doubleClickCard = (
    event: React.MouseEvent<Element, MouseEvent>,
    node: CardNode
  ) => {
    event.stopPropagation();
    setNodeEditMode(node.id, true);
    setcurrentlyEditingCardId(node.id);
  };

  const setCardEditModeOff = useCallback(() => {
    if (currentlyEditingCardId) {
      setNodeEditMode(currentlyEditingCardId, false);
      setcurrentlyEditingCardId(null);
    }
  }, [currentlyEditingCardId, setNodeEditMode]);

  const maybeSetCardEditModeOff = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, node: CardNode) => {
      e.stopPropagation();
      if (currentlyEditingCardId && currentlyEditingCardId !== node.id) {
        setcurrentlyEditingCardId(null);
        setNodeEditMode(currentlyEditingCardId, false);
      }
    },
    [currentlyEditingCardId, setNodeEditMode]
  );

  const doubleClickEdge = (
    event: React.MouseEvent<Element, MouseEvent>,
    edge: LinkEdge
  ) => {
    event.stopPropagation();
    setEdgeEditMode(edge.id, true);
  };

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      {/* <button onClick={handleAnimate}>animate</button> */}
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
        onEdgeDoubleClick={(event, edge) => doubleClickEdge(event, edge)}
        onPaneClick={setCardEditModeOff}
        maxZoom={10}
        minZoom={0.1}
        onClick={handleCanvasClick}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}
