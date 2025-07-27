import { DeckInfo } from "../Types/appDataTypes";
import styles from "./DeckFrame.module.scss";
import "@szhsin/react-menu/dist/core.css";
import "./DeckMenu.scss";
import { DisplayDeckInfo } from "./DisplayDeckInfo";
import EditDeckForm from "./EditDeckForm";
import { useState, useRef, useEffect, useCallback } from "react";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { Network, Pen, SquarePen, Trash } from "lucide-react";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { useStoreDecksInfo } from "../store/graphdecksDataSlice";
import { useLabView } from "../store/UISlice";

export default function DeckFrame({ deckInfo }: { deckInfo: DeckInfo }) {
  const [editingDeck, setEditingDeck] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const setActiveDeckInfo = useGraphcardsStore(
    useShallow((state) => state.setActiveDeckInfo)
  );

  const decksInfo = useStoreDecksInfo();

  const { setLabView } = useLabView();

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: MouseEvent) {
      console.log("---", frameRef.current, event.target);

      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        if (editingDeck) {
          setEditingDeck(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, editingDeck]);

  const viewDeck = (deckId: string) => {
    const activeDeckInfo = decksInfo.find(
      (deckInfo) => deckInfo._id === deckId
    );
    if (activeDeckInfo) {
      setActiveDeckInfo(activeDeckInfo);
      setLabView("activeDeck");
    }
  };

  const deleteDeck = useCallback(async (deckId: string) => {
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
        <EditDeckForm deckInfo={deckInfo} setEditDeckMode={setEditingDeck} />
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
            <ContextMenuItem onClickItem={() => deleteDeck(deckInfo._id)}>
              <Trash size={18} />
            </ContextMenuItem>
          </ContextMenu>
        </div>
      )}
    </div>
  );
}
