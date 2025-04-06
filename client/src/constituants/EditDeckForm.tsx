import { useState } from "react";
import styles from "./EditDeckForm.module.scss";
import { DeckFormFields, DeckInfo } from "../Types/types";
import Button from "../components/Button";
import { deckFormFieldsFromDeckInfo, deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";
import { useDecksInfo } from "../hooks/useDecksInfo";

export default function EditDeckForm({
  setEditDeckMode,
  deckInfo,
}: {
  setEditDeckMode: React.Dispatch<React.SetStateAction<string | null>>;
  deckInfo: DeckInfo;
}) {
  const { data: decksInfo, error, isLoading, mutate } = useDecksInfo();

  const [deckFormFields, setDeckFormFields] = useState<DeckFormFields>(
    deepCopy(deckFormFieldsFromDeckInfo(deckInfo))
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEditDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditDeckMode(null);
  };

  const handleEditDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!deckFormFields.name.trim()) {
      alert("GraphDeck must have a name");
      return;
    }

    // Set loading state and close form immediately for better UX
    setIsEditing(true);
    setEditDeckMode(null);

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
        <Button onClick={handleCancelEditDeck} disabled={isEditing}>
          cancel
        </Button>
        <Button onClick={handleEditDeck} disabled={isEditing}>
          {isEditing ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
