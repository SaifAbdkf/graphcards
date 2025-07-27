import { useEffect, useRef, useState } from "react";
import styles from "./CreateDeck.module.scss";
import CreateDeckForm from "./CreateDeckForm";

export default function CreateDeck() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (!createDeckMode) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setCreateDeckMode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activateCreateDeckMode = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (!createDeckMode) {
        setCreateDeckMode(true);
      }
    }
  };

  return (
    <div
      ref={frameRef}
      onClick={activateCreateDeckMode}
      key="add-decks"
      className={`${styles.deckRepresentation} ${styles.addDeck} ${
        createDeckMode ? styles.addDeckNoHover : ""
      }`}
    >
      {!createDeckMode ? (
        <div
          className={`${styles.scrollableDeckContent}`}
          onClick={() => !createDeckMode && setCreateDeckMode(true)}
        >
          <div>Create </div>
          <div>GraphDeck</div>
        </div>
      ) : (
        <div className={`${styles.scrollableDeckContent}`}>
          <CreateDeckForm setCreateDeckMode={setCreateDeckMode} />
        </div>
      )}
    </div>
  );
}
