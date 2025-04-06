import { useCallback, useState } from "react";
import { DeckInfo } from "../Types/types";
import styles from "./Deck.module.scss";
import { deleteDeckRequest, getDeckRequest } from "../services/api/decksApi";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditDeckForm from "./EditDeckForm";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";

import "@szhsin/react-menu/dist/core.css";
import "./DeckMenu.scss";
import { setSelectedDeck } from "../store/slices/deckSlice";

export default function Deck({ deckInfo }: { deckInfo: DeckInfo }) {
  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeckClick = (deckId: string) => {
    const fetchDeck = async () => {
      const selectedDeck = await getDeckRequest(deckId);
      dispatch(setSelectedDeck(selectedDeck));
      navigate("/playground");
    };
    if (!editingDeck) {
      fetchDeck();
    }
  };

  const handleDeckEditIConClick = useCallback((deckId: string) => {
    setEditingDeck(deckId);
  }, []);

  const handleDeleteDeck = useCallback(
    async (deckId: string) => {
      try {
        dispatch(deleteDeckInfo(deckInfo));

        const isdeleted = await deleteDeckRequest(deckId);
        // Refresh store state before DB
        if (isdeleted) {
          dispatch(resetRollbackDeckInfo());
          //good
        } else {
          dispatch(rollbackDeckInfo());
          alert("error deleting deck. Please try again");
        }
      } catch (error) {
        console.error("error deleting deck: ", error);
        dispatch(rollbackDeckInfo());
        alert("An error occurred while editing the deck");
      }
    },
    [deckInfo, dispatch]
  );

  return (
    <div key={deckInfo._id} className={`${styles.deckSpace}`}>
      <div
        className={`${styles.deckRepresentation} ${styles.deckInfoContainer}`}
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
            <MenuItem onClick={() => handleDeckEditIConClick(deckInfo._id)}>
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
