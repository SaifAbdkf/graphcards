import { useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import Button from "./Button";

import DeckForm from "./DeckForm";
import { DeckFields } from "../Types/appDataTypes";

import { createDeckInfo } from "../services/api/deckInfoApi";

export default function CreateDeckForm({
  setCreateDeckMode,
  deckFields,
  setDeckFields,
}: {
  setCreateDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
  deckFields: DeckFields;
  setDeckFields: React.Dispatch<React.SetStateAction<DeckFields>>;
}) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!deckFields.name.trim()) {
      alert("Please enter a name for your deck");
      return;
    }

    // Set loading state (isCreating) and close form immediately for better UX
    setIsCreating(true);
    setCreateDeckMode(false);
    createDeckInfo(deckFields);
  };

  return (
    <div className={`${styles.formContainer}`}>
      <DeckForm deckFields={deckFields} setDeckFields={setDeckFields} />

      <div className={styles.buttonsContainer}>
        <Button
          onClick={handleCreateDeck}
          disabled={isCreating || deckFields.name === ""}
        >
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
