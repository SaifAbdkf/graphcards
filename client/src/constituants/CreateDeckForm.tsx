import { useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import Button from "../components/Button";
import { deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";
import { DeckFields, emptyDeckFields } from "../Types/appDataTypes";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export default function CreateDeckForm({
  setCreateDeckMode,
}: {
  setCreateDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const addDeckInfo = useGraphcardsStore(
    useShallow((state) => state.addDeckInfo)
  );
  const [deckFields, setDeckFields] = useState<DeckFields>(
    deepCopy(emptyDeckFields)
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleCancelCreateDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeckFields(deepCopy(emptyDeckFields));
    setCreateDeckMode(false);
  };

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
    addDeckInfo(deckFields);
  };

  return (
    <div className={`${styles.formContainer}`}>
      <DeckForm deckFields={deckFields} setDeckFields={setDeckFields} />

      <div className={styles.buttonsContainer}>
        <Button onClick={handleCancelCreateDeck} disabled={isCreating}>
          cancel
        </Button>
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
