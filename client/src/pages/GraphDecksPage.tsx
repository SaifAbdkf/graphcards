import { useDispatch, useSelector } from "react-redux";
import "@szhsin/react-menu/dist/core.css";

import styles from "./GraphDecksPage.module.scss";
import { useCallback, useEffect, useState } from "react";
import { getDeck, getDecksInfo } from "../services/api/decksApi";
import { setActiveDeck, setDecksInfo } from "../store/slices/deckSlice";
// import "@szhsin/react-menu/dist/index.css";
import "../components/menu.scss";

import { useNavigate } from "react-router-dom";
import { selectDecksInfo } from "../store/selectors/deckSelector";
import CreateDeckForm from "../constituants/CreateDeckForm";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Menu, MenuItem } from "@szhsin/react-menu";

export default function GraphDecksPage() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const decksInfo = useSelector(selectDecksInfo);
  // TODO: special effect to selected deck
  // const activeDeck = useSelector(selectActiveDeck);

  useEffect(() => {
    const fetchDecksInfo = async () => {
      const fetchedDecksInfo = await getDecksInfo();
      dispatch(setDecksInfo(fetchedDecksInfo));
    };

    fetchDecksInfo();
  }, [dispatch]);

  const handleDeckClick = useCallback(
    (deckId: string) => {
      const fetchDeck = async () => {
        const selectedDeck = await getDeck(deckId);
        dispatch(setActiveDeck(selectedDeck));
        navigate("/playground");
      };
      fetchDeck();
    },
    [navigate]
  );

  return (
    <div className={styles.decksPageContainer}>
      <h1>My GraphDecks</h1>

      <div className={styles.decksList}>
        <div
          onClick={() => setCreateDeckMode(true)}
          key="add-decks"
          className={`${styles.deckRepresentation} ${styles.addDeck} ${
            createDeckMode && styles.addDeckNoHover
          }`}
        >
          <div className={`${styles.scrollableDeckContent}`}>
            {!createDeckMode ? (
              <>
                <div>Create </div>
                <div>GraphDeck</div>
              </>
            ) : (
              <CreateDeckForm />
            )}
          </div>
        </div>

        {decksInfo?.map((deckInfo) => (
          <div className={`${styles.deckSpace}`}>
            <div
              key={deckInfo.name}
              className={`${styles.deckRepresentation} ${styles.deckInfoContainer}`}
              onClick={() => handleDeckClick(deckInfo._id)}
            >
              <div className={`${styles.scrollableDeckContent}`}>
                <div className={`${styles.deckInfoContainer}`}>
                  {deckInfo.name}
                </div>
                <div className={`${styles.deckDecriptionContainer}`}>
                  {deckInfo.description}
                </div>
              </div>
            </div>
            <div className={`${styles.deckEllipsisContainer}`}>
              <Menu menuButton={<EllipsisVertical />}>
                <MenuItem>
                  <div className={`${styles.itemDiv}`}>
                    <Pencil className={`${styles.deckEditIcon}`} size={14} />
                    <div>Edit</div>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className={`${styles.itemDiv}`}>
                    <Trash className={`${styles.deckTrashIcon}`} size={14} />
                    <div>Delete</div>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
