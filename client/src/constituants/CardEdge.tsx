import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react";
import styles from "./CardEdge.module.scss";
import { Edge } from "../Types/types";

export default function CardEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  id: string;
  data: Edge;
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
