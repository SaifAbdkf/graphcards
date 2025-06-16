import { Handle, Position } from "@xyflow/react";
import styles from "./CardNodeComponent.module.scss";
import { AppCard } from "../Types/appDataTypes";
import CardEditContent from "./CardEditContent";
import CardDisplayContent from "./CardDisplayContent";
import { Edit, Trash } from "lucide-react";
import { useGraphcardStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export function CardNodeComponent({
  data,
  selected,
}: {
  data: AppCard;
  selected: boolean;
}) {
  const { onDeleteNode } = useGraphcardStore(
    useShallow((state) => ({
      onDeleteNode: state.onDeleteNode,
    }))
  );

  const handleStyle = {
    background: "white",
    border: "1px solid black",
    width: "7px",
    height: "7px",
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection when clicking delete
    onDeleteNode(data._id);
  };

  return (
    <>
      {selected && (
        <div className={`${styles.contextMenuContainer}`}>
          <div className={`${styles.iconContainer} ${styles.editContainer}`}>
            <Edit size={16} color="gray" />
          </div>
          <div className={`${styles.iconContainer}`} onClick={handleDelete}>
            <Trash size={16} />
          </div>
        </div>
      )}
      <Handle
        id={"top"}
        type="source"
        position={Position.Top}
        style={handleStyle}
      />
      <Handle
        id={"left"}
        type="source"
        position={Position.Left}
        style={handleStyle}
      />
      <Handle
        id={"right"}
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
      <Handle
        id={"bottom"}
        type="source"
        position={Position.Bottom}
        style={handleStyle}
      />
      <div
        className={`${styles.cardNodeContainer} ${
          selected && styles.selectedCardNodeContainer
        }`}
      >
        {data.editMode ? (
          <CardEditContent cardData={data} />
        ) : (
          <CardDisplayContent cardData={data} />
        )}
      </div>
    </>
  );
}
