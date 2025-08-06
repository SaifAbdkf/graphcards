import "@xyflow/react/dist/style.css";
import { CardNode, LinkEdge } from "../Types/appDataTypes";
import {
  ConnectionMode,
  Controls,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { CardNodeComponent } from "./CardNodeComponent";
import { useCallback, useRef } from "react";
import LinkEdgeComponent from "./LinkEdgeComponent";
import styles from "./ActiveGraphDeck.module.scss";
import { ObjectId } from "bson";
import { useActiveDeckInfo } from "../store/graphdecksDataSlice";
import { useActiveGraphcard } from "../store/graphcardsDataSlice";
const nodeTypes = {
  cardNode: CardNodeComponent,
};

const edgeTypes = {
  LinkEdge: LinkEdgeComponent,
};

export default function ActiveGraphDeck() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    nodes,
    edges,
    editingNodeId,
    setNodeEditMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setEdgeEditMode,
  } = useActiveGraphcard();

  const { activeDeckInfo } = useActiveDeckInfo();

  console.log("nodes are ", nodes);

  const { screenToFlowPosition } = useReactFlow();

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

    addNode(emptyCardNode);
    setNodeEditMode(newCardId, true);
  };

  const doubleClickCard = (
    event: React.MouseEvent<Element, MouseEvent>,
    node: CardNode
  ) => {
    event.stopPropagation();
    setNodeEditMode(node.id, true);
  };

  const setCardEditModeOff = useCallback(() => {
    if (editingNodeId) {
      setNodeEditMode(editingNodeId, false);
    }
  }, [editingNodeId, setNodeEditMode]);

  const maybeSetCardEditModeOff = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, node: CardNode) => {
      e.stopPropagation();
      if (editingNodeId && editingNodeId !== node.id) {
        setNodeEditMode(editingNodeId, false);
      }
    },
    [editingNodeId, setNodeEditMode]
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
