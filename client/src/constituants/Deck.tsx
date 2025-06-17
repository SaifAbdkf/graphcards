import { useCallback, useState } from "react";
import { DeckInfo } from "../Types/appDataTypes";
import styles from "./Deck.module.scss";
import { deleteDeckRequest } from "../services/api/deckRequests";

import { useNavigate } from "react-router-dom";
import EditDeckForm from "./EditDeckForm";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import "@szhsin/react-menu/dist/core.css";
import "./DeckMenu.scss";
import { fetchDecksInfo, useDecksInfo } from "../hooks/useDecksInfo";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export default function Deck({ deckInfo }: { deckInfo: DeckInfo }) {
  const { data: decksInfo, mutate } = useDecksInfo();

  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const navigate = useNavigate();
  const setActiveDeckInfo = useGraphcardsStore(
    useShallow((state) => state.setActiveDeckInfo)
  );

  const handleDeckClick = (deckId: string) => {
    const activeDeckInfo = decksInfo.find(
      (deckInfo) => deckInfo._id === deckId
    );
    if (activeDeckInfo) {
      setActiveDeckInfo({ ...activeDeckInfo, dbAction: "none" });
    }

    navigate("/lab");
  };

  const handleDeckEditIconClick = useCallback((deckId: string) => {
    setEditingDeck(deckId);
  }, []);

  const handleDeleteDeck = useCallback(
    async (deckId: string) => {
      const optimisticDecksInfo = decksInfo.filter(
        (deckInfoElement) => deckInfoElement._id !== deckId
      );

      const options = {
        optimisticData: optimisticDecksInfo,
        rollbackOnError: true,
      };

      mutate(
        `/deck/all`,
        async () => {
          await deleteDeckRequest(deckId);
          const updatedDecksInfo = await fetchDecksInfo();
          return updatedDecksInfo;
        },
        options
      );
    },
    [decksInfo, mutate]
  );

  return (
    <div key={deckInfo._id} className={`${styles.deckSpace}`}>
      <div
        className={`${styles.deckRepresentation} ${styles.deckInfoContainer} ${
          editingDeck ? styles.editDeckNoHover : ""
        }`}
        onClick={() => handleDeckClick(deckInfo._id)}
      >
        <div className={`${styles.scrollableDeckContent}`}>
          {editingDeck !== null && editingDeck === deckInfo._id ? (
            <EditDeckForm
              deckInfo={deckInfo}
              setEditDeckMode={setEditingDeck}
            />
          ) : (
            <>
              <div className={`${styles.deckNameContainer}`}>
                {deckInfo.name}
              </div>
              <div className={`${styles.deckDecriptionContainer}`}>
                {deckInfo.description}
              </div>
            </>
          )}
        </div>
      </div>
      {!editingDeck && (
        <div className={`${styles.deckEllipsisContainer}`}>
          <Menu
            menuButton={
              <EllipsisVertical
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            }
          >
            <MenuItem onClick={() => handleDeckEditIconClick(deckInfo._id)}>
              <div className={`${styles.itemDiv}`}>
                <Pencil className={`${styles.deckEditIcon}`} size={14} />
                <div>Edit</div>
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleDeleteDeck(deckInfo._id)}>
              <div className={`${styles.itemDiv}`}>
                <Trash className={`${styles.deckTrashIcon}`} size={14} />
                <div>Delete</div>
              </div>
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}
