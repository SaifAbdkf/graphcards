import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
  useNodes,
} from "@xyflow/react";
import styles from "./CardEdge.module.scss";
import { Link } from "../Types/types";
import { getSmartEdge } from "@tisoap/react-flow-smart-edge";

export default function LinkEdge({
  id,
  data,
  sourcePosition,
  targetPosition,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  id: string;
  data: Link;
  sourcePosition: Position;
  targetPosition: Position;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const markerId = `arrowhead-${id}`;
  const nodes = useNodes();
  console.log("positions:", sourcePosition, targetPosition);
  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
  });

  console.log(getSmartEdgeResponse);

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="7"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>

      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="black"
        strokeWidth={1.5}
        markerEnd={`${data?.isDirected ? `url(#${markerId})` : undefined} `}
      />

      <EdgeLabelRenderer>
        {data?.label && (
          <div
            className={`${styles.labelContainer}`}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px) `,
            }}
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
