import { DeckFields, DeckInfo } from "../Types/appDataTypes";
import styles from "./DeckFrame.module.scss";
import "@szhsin/react-menu/dist/core.css";
import "./DeckMenu.scss";
import { DisplayDeckInfo } from "./DisplayDeckInfo";
import EditDeckForm from "./EditDeckForm";
import { useState, useRef, useEffect, useCallback } from "react";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { SquarePen, Trash } from "lucide-react";
import { useSWRConfig } from "swr";
import { useGraphdeckApi } from "../hooks/useGraphDeckApi";
import { useDeckInfoApi } from "../hooks/useDeckInfoApi";

export default function DeckFrame({ deckInfo }: { deckInfo: DeckInfo }) {
  const [editingDeck, setEditingDeck] = useState(false);
  const [selected, setSelected] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // is gonna cost a lot of prop drilling but i can call editDeckField in use effect when clicking outside
  // will be fixed in the future when i use the store for this and dbAction
  const [deckFields, setDeckFields] = useState<DeckFields>({
    name: deckInfo.name,
    description: deckInfo.description,
  });

  const { mutate } = useSWRConfig();
  const graphdeckAPI = useGraphdeckApi();

  const deckInfoAPI = useDeckInfoApi();
  useEffect(() => {
    if (!selected) return;
    async function handleClickOutside(event: MouseEvent) {
      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setSelected(false);
        if (editingDeck) {
          setEditingDeck(false);
          await deckInfoAPI.updateDeckInfo(deckInfo._id, deckFields, mutate);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selected, editingDeck, deckFields, deckInfo._id, deckInfoAPI, mutate]);

  const onDeleteDeck = useCallback(
    async (deckId: string) => {
      const response = await graphdeckAPI.deleteGraphdeck(deckId, mutate);
      console.log("deletion successful ", response);
    },
    [graphdeckAPI, mutate]
  );

  return (
    <div
      ref={frameRef}
      key={deckInfo._id}
      className={`${styles.deckFrame} ${selected && styles.deckFrameSelected}`}
      onClick={() => setSelected(true)}
    >
      {editingDeck ? (
        <EditDeckForm deckFields={deckFields} setDeckFields={setDeckFields} />
      ) : (
        <DisplayDeckInfo deckInfo={deckInfo} isSelected={selected} />
      )}
      {selected && (
        <div className={`${styles.contextMenuContainer}`}>
          <ContextMenu>
            <ContextMenuItem onClickItem={() => setEditingDeck(true)}>
              <SquarePen size={18} />
            </ContextMenuItem>
            <ContextMenuItem onClickItem={() => onDeleteDeck(deckInfo._id)}>
              <Trash size={18} />
            </ContextMenuItem>
          </ContextMenu>
        </div>
      )}
    </div>
  );
}
