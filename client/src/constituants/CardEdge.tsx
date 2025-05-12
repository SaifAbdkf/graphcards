import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
} from "@xyflow/react";
import styles from "./CardEdge.module.scss";

export default function CardEdge({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  id: string;
  data: { label: undefined | string };
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
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
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}
