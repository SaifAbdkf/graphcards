import { Handle, Position } from "@xyflow/react";
import styles from "./CardNodeComponent.module.scss";
import { AppCard } from "../Types/appDataTypes";
import CardEditContent from "./CardEditContent";
import CardDisplayContent from "./CardDisplayContent";
import { Edit, Trash } from "lucide-react";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";

export function CardNodeComponent({
  data,
  selected,
}: {
  data: AppCard;
  selected: boolean;
}) {
  const { deleteNode, setNodeEditMode } = useGraphcardsStore(
    useShallow((state) => ({
      deleteNode: state.deleteNode,
      setNodeEditMode: state.setNodeEditMode,
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
    deleteNode(data._id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection when clicking delete
    setNodeEditMode(data._id, true);
  };

  return (
    <>
      {selected && (
        <div className={`${styles.contextMenuContainer}`}>
          <ContextMenu>
            <ContextMenuItem onClickItem={handleEdit}>
              <Edit size={16} />
            </ContextMenuItem>
            <ContextMenuItem onClickItem={handleDelete}>
              <Trash size={16} />
            </ContextMenuItem>
          </ContextMenu>
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
