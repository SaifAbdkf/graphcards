import "@xyflow/react/dist/style.css";
import { ConnectionMode, ReactFlow, useReactFlow } from "@xyflow/react";
import { CardNodeComponent } from "./CardNodeComponent";
import { GraphcardsStoreState, useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { useRef } from "react";
import LinkEdgeComponent from "./LinkEdgeComponent";
import styles from "./TestGraphdeck.module.scss";
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

export default function TestGraphdeck() {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        maxZoom={10}
        minZoom={0.1}
        onClick={handleCanvasClick}
      >
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 100,
            background: "white",
            zIndex: 1000,
          }}
        >
          test controls learned or not learned card absolutely positioned under
          the tested card
        </div>
      </ReactFlow>
    </div>
  );
}
