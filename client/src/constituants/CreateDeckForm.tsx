import { useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import { DeckFormFields, emptyDeckFormFields } from "../Types/types";
import Button from "../components/Button";
import { createDeckInfoRequest } from "../services/api/decksApi";
import { deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";
import { fetchDecksInfo, useDecksInfo } from "../hooks/useDecksInfo";

export default function CreateDeckForm({
  setCreateDeckMode,
}: {
  setCreateDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: decksInfo, mutate } = useDecksInfo();
  const [deckFormFields, setDeckFormFields] = useState<DeckFormFields>(
    deepCopy(emptyDeckFormFields)
  );

  const [isCreating, setIsCreating] = useState(false);

  const handleCancelCreateDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeckFormFields(deepCopy(emptyDeckFormFields));
    setCreateDeckMode(false);
  };

  const handleCreateDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!deckFormFields.name.trim()) {
      alert("Please enter a name for your deck");
      return;
    }

    // Set loading state (isCreating) and close form immediately for better UX
    setIsCreating(true);
    setCreateDeckMode(false);

    const optimisticDecksInfo = [
      ...decksInfo,
      { _id: Date.now(), ...deckFormFields },
    ];
    const options = {
      optimisticData: optimisticDecksInfo,
      rollbackOnError: true,
    };

    mutate(
      `/deck/all`,
      async () => {
        await createDeckInfoRequest(deckFormFields);
        const updatedDecksInfo = await fetchDecksInfo();
        return updatedDecksInfo;
      },
      options
    );
  };

  return (
    <div className={`${styles.formContainer}`}>
      <DeckForm
        deckFormFields={deckFormFields}
        setDeckFormFields={setDeckFormFields}
      />

      <div className={styles.buttonsContainer}>
        <Button onClick={handleCancelCreateDeck} disabled={isCreating}>
          cancel
        </Button>
        <Button
          onClick={handleCreateDeck}
          disabled={isCreating || deckFormFields.name === ""}
        >
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
