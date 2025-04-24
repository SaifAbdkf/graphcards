import { useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import { DeckFields, DeckInfo, emptyDeckFields } from "../Types/types";
import Button from "../components/Button";
import { createDeckInfoRequest } from "../services/api/deckRequests";
import { deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";
import { fetchDecksInfo, useDecksInfo } from "../hooks/useDecksInfo";

export default function CreateDeckForm({
  setCreateDeckMode,
}: {
  setCreateDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: decksInfo, mutate } = useDecksInfo();
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

    const optimisticDecksInfo: DeckInfo[] = [
      ...decksInfo,
      { _id: Date.now().toString(), ...deckFields },
    ];
    const options = {
      optimisticData: optimisticDecksInfo,
      rollbackOnError: true,
    };

    mutate(
      `/deck/all`,
      async () => {
        await createDeckInfoRequest(deckFields);
        const updatedDecksInfo = await fetchDecksInfo();
        return updatedDecksInfo;
      },
      options
    );
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
