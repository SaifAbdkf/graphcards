import { useState } from "react";
import styles from "./EditDeckForm.module.scss";
import { DeckFormFields, DeckInfo } from "../Types/types";
import Button from "../components/Button";
import DeckForm from "../components/DeckForm";
import { fetchDecksInfo, useDecksInfo } from "../hooks/useDecksInfo";
import { editDeckInfoRequest } from "../services/api/deckRequests";

export default function EditDeckForm({
  setEditDeckMode,
  deckInfo,
}: {
  setEditDeckMode: React.Dispatch<React.SetStateAction<string | null>>;
  deckInfo: DeckInfo;
}) {
  const { data: decksInfo, mutate } = useDecksInfo();

  const [deckFormFields, setDeckFormFields] = useState<DeckFormFields>({
    name: deckInfo.name,
    description: deckInfo.description,
  });
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

    const optimisticDecksInfo = decksInfo.map((deckInfoElement) =>
      deckInfoElement._id !== deckInfo._id
        ? deckInfoElement
        : { _id: deckInfo._id, ...deckFormFields }
    );

    const options = {
      optimisticData: optimisticDecksInfo,
      rollbackOnError: true,
    };

    mutate(
      `/deck/all`,
      async () => {
        await editDeckInfoRequest(deckInfo._id, deckFormFields);
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
