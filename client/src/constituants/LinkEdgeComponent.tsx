import { EdgeLabelRenderer, EdgeProps } from "@xyflow/react";
import styles from "./LinkEdgeComponent.module.scss";
import { LinkEdge } from "../Types/types";
import { getMyBezierPath } from "./mybezier";
import { useGraphcardStore } from "../zustore/store";
import { useShallow } from "zustand/shallow";
import { Edit, Trash } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";

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
  const { onDeleteEdge, setEdgeEditMode, setLinkEdgeLabel } = useGraphcardStore(
    useShallow((state) => ({
      onDeleteEdge: state.onDeleteEdge,
      setEdgeEditMode: state.setEdgeEditMode,
      setLinkEdgeLabel: state.setLinkEdgeLabel,
    }))
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.editMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [data?.editMode]);

  const handleLabelFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const label = e.target.value;
      setLinkEdgeLabel(id, label);
    },
    [id, setLinkEdgeLabel]
  );

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
    if (data) onDeleteEdge(id);
  };

  const handleEdgeEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdgeEditMode(id, true);
  };
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
        strokeWidth={selected ? 2.2 : 1.5}
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
              zIndex: 1000,
            }}
            className={`${styles.contextMenuContainer}`}
          >
            <div
              className={`${styles.iconContainer} ${styles.editContainer}`}
              style={{ pointerEvents: "all", cursor: "pointer" }}
            >
              <Edit size={16} color="gray" onClick={handleEdgeEditClick} />
            </div>
            <div
              className={`${styles.iconContainer}`}
              style={{ pointerEvents: "all", cursor: "pointer" }}
            >
              <Trash
                style={{ pointerEvents: "all", cursor: "pointer" }}
                onClick={handleEdgeDelete}
                size={16}
              />
            </div>
          </div>
        )}
        {data?.editMode && (
          <div
            className={`${styles.labelContainer}`}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px) `,
            }}
          >
            <input
              ref={inputRef}
              style={{ pointerEvents: "all", cursor: "pointer" }}
              type="text"
              value={data.label}
              onChange={handleLabelFieldChange}
              onDoubleClick={(e) => {
                e.stopPropagation();
              }}
            ></input>
          </div>
        )}
        {data?.label && !data?.editMode && (
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
