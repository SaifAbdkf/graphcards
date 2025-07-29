import { DeckFields, DeckInfo } from "../Types/appDataTypes";
import styles from "./DeckFrame.module.scss";
import "@szhsin/react-menu/dist/core.css";
import "./DeckMenu.scss";
import { DisplayDeckInfo } from "./DisplayDeckInfo";
import EditDeckForm from "./EditDeckForm";
import { useState, useRef, useEffect, useCallback } from "react";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { Network, SquarePen, Trash } from "lucide-react";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { useStoreDecksInfo } from "../store/graphdecksDataSlice";
import { useLabView } from "../store/UISlice";
import { useDeckInfoAPI } from "../hooks/useDeckInfoAPI";
import { deleteDeck } from "../services/nodeApi/graphdeckNodeApi";

export default function DeckFrame({ deckInfo }: { deckInfo: DeckInfo }) {
  const [editingDeck, setEditingDeck] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // is gonna cost a lot of prop drilling but i can call editDeckField in use effect when clicking outside
  // will be fixed in the future when i use the store for this and dbAction
  const [deckFields, setDeckFields] = useState<DeckFields>({
    name: deckInfo.name,
    description: deckInfo.description,
  });

  const setActiveDeckInfo = useGraphcardsStore(
    useShallow((state) => state.setActiveDeckInfo)
  );

  const decksInfo = useStoreDecksInfo();
  const { setLabView } = useLabView();
  const deckInfoAPI = useDeckInfoAPI();
  useEffect(() => {
    if (!showMenu) return;
    async function handleClickOutside(event: MouseEvent) {
      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        if (editingDeck) {
          console.log("gonna edit", deckFields);

          setEditingDeck(false);
          await deckInfoAPI.updateDeckInfo(deckInfo._id, deckFields);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, editingDeck, deckFields, deckInfo._id, deckInfoAPI]);

  const viewDeck = (deckId: string) => {
    const activeDeckInfo = decksInfo.find(
      (deckInfo) => deckInfo._id === deckId
    );
    if (activeDeckInfo) {
      setActiveDeckInfo(activeDeckInfo);
      setLabView("activeDeck");
    }
  };

  const onDeleteDeck = useCallback(async (deckId: string) => {
    const response = await deleteDeck(deckId);
    console.log("deletion successful ", response);
  }, []);

  return (
    <div
      ref={frameRef}
      key={deckInfo._id}
      className={`${styles.deckFrame} ${showMenu && styles.deckFrameSelected}`}
      onClick={() => setShowMenu(true)}
    >
      {editingDeck ? (
        <EditDeckForm deckFields={deckFields} setDeckFields={setDeckFields} />
      ) : (
        <DisplayDeckInfo deckInfo={deckInfo} />
      )}
      {showMenu && (
        <div className={`${styles.contextMenuContainer}`}>
          <ContextMenu>
            <ContextMenuItem onClickItem={() => viewDeck(deckInfo._id)}>
              <Network size={18} />
            </ContextMenuItem>
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
