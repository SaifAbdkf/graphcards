import "@xyflow/react/dist/style.css";
import { Deck } from "../Types/types";
import {
  addEdge,
  Connection,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";

export default function TestGraph({ deck }: { deck: Deck }) {
  const initialNodes = deck.cards.map((card, index) => ({
    id: card._id,
    data: {
      label: <div style={{ height: "200px", color: "blue" }}>card.front</div>,
    },
    position: { x: index * 100, y: 100 },
  }));

  const initialEdges = deck.edges.map((edge) => ({
    id: edge._id,
    source: edge.from,
    target: edge.to,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [viewPort, setViewPort] = useState({ x: 10, y: 10, zoom: 3 });
  const [flag, setFlag] = useState(false);

  const { setViewport } = useReactFlow();
  const handleTransition = () => {
    setViewport({ x: 100, y: 200, zoom: 1 }, { duration: 200 });
  };

  const handleClick = () => {
    console.log("asba");
    handleTransition();
    //   setFlag(!flag);
    //   setInterval(() => {
    //     console.log("aaaa");
    //     setViewPort((viewPort) => ({
    //       x: viewPort.x + 100,
    //       y: viewPort.y + 100,
    //       zoom: viewPort.zoom,
    //     }));
    //   }, 500);
    // };
    // console.log(viewPort);
  };
  return (
    <>
      <button onClick={handleClick}>test action</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        panOnDrag={false}
        preventScrolling={false}
        zoomActivationKeyCode={null}
        // viewport={(flag && viewPort) || undefined}
        // disable zoom using ctrl + mouse wheel + touchpad
        // maxZoom={1}
        // minZoom={1}
      />
    </>
  );
}
