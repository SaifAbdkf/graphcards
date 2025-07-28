import { useEffect, useRef, useState } from "react";
import styles from "./CreateDeck.module.scss";
import CreateDeckForm from "./CreateDeckForm";
import { deepCopy } from "../utils/utils";
import { DeckFields, emptyDeckFields } from "../Types/appDataTypes";

export default function CreateDeck() {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [deckFields, setDeckFields] = useState<DeckFields>(
    deepCopy(emptyDeckFields)
  );
  useEffect(() => {
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
      className={`${styles.addDeckFrame} ${
        createDeckMode ? styles.addDeckNoHover : ""
      }`}
    >
      {!createDeckMode ? (
        <>
          <div>Create </div>
          <div>GraphDeck</div>
        </>
      ) : (
        <CreateDeckForm
          setCreateDeckMode={setCreateDeckMode}
          deckFields={deckFields}
          setDeckFields={setDeckFields}
        />
      )}
    </div>
  );
}
