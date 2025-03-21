import { useState } from "react";
import styles from "./AddDeck.module.scss";
import CreateDeckForm from "./CreateDeckForm";

export default function AddDeck() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only respond to clicks directly on the container (e.currentTarget), not on children elements (e.target)
    // this is necessary because every click inside addDeck div will trigger this method handleContainerClick
    if (e.target === e.currentTarget) {
      if (!createDeckMode) {
        setCreateDeckMode(true);
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      // onClick={!createDeckMode ? handleContainerClick : undefined}
      key="add-decks"
      className={`${styles.deckRepresentation} ${styles.addDeck} ${
        createDeckMode ? styles.addDeckNoHover : ""
      }`}
    >
      <div className={`${styles.scrollableDeckContent}`}>
        {!createDeckMode ? (
          <>
            <div>Create </div>
            <div>GraphDeck</div>
          </>
        ) : (
          <CreateDeckForm setCreateDeckMode={setCreateDeckMode} />
        )}
      </div>
    </div>
  );
}
