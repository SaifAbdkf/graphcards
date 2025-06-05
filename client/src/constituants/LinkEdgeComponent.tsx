import { EdgeLabelRenderer, EdgeProps } from "@xyflow/react";
import styles from "./LinkEdgeComponent.module.scss";
import { LinkEdge } from "../Types/types";
import { getMyBezierPath } from "./mybezier";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import { Edit, Trash } from "lucide-react";

export default function LinkEdgeComponent({
  id,
  data,
  sourcePosition,
  targetPosition,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: EdgeProps<LinkEdge>) {
  const { onDeleteEdge } = useGraphcardStore(
    useShallow((state) => ({
      onDeleteEdge: state.onDeleteEdge,
    }))
  );

  if (!data) return null;

  const [edgePath, labelX, labelY] = getMyBezierPath({
    sourceX: sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleEdgeDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteEdge(data._id);
    console.log("delete edge");
  };

  const markerId = `arrowhead-${id}`;
  console.log("id is", id);
  console.log("selected", selected);
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
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            className={
              selected ? styles.selectedMarker : styles.unselectedMarker
            }
          />
        </marker>
      </defs>

      <path
        id={id}
        d={edgePath}
        fill="none"
        className={selected ? styles.selectedEdge : styles.unselectedEdge}
        strokeWidth={selected ? 2.5 : 1.5}
        style={{ cursor: "pointer" }}
      />
      <path
        id={id}
        d={edgePath}
        fill="none"
        className={selected ? styles.selectedEdge : styles.unselectedEdge}
        strokeWidth={selected ? 1.8 : 1.5}
        markerEnd={`${data?.isDirected ? `url(#${markerId})` : undefined} `}
        style={{ cursor: "pointer" }}
      />

      {/* Add an invisible wider path for better interaction */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={10}
        style={{ cursor: "pointer" }}
      />

      <EdgeLabelRenderer>
        {selected && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${
                labelY - 30
              }px)`,
              pointerEvents: "all",
              zIndex: 1000,
            }}
            className={`${styles.contextMenuContainer}`}
          >
            <div
              className={`${styles.iconContainer} ${styles.editContainer}`}
              style={{ pointerEvents: "all", cursor: "pointer" }}
            >
              <Edit size={16} color="gray" />
            </div>
            <div
              className={`${styles.iconContainer}`}
              style={{ pointerEvents: "all", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("cliiiiick");
              }}
            >
              <Trash
                style={{ pointerEvents: "all", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdgeDelete(e);
                }}
                size={16}
              />
            </div>
          </div>
        )}
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
