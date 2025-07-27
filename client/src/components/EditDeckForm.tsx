import { useState } from "react";
import styles from "./EditDeckForm.module.scss";
import { DeckFields, DeckInfo } from "../Types/appDataTypes";
import Button from "./Button";
import DeckForm from "./DeckForm";
import { editDeckInfo } from "../services/api/deckInfoApi";

export default function EditDeckForm({
  setEditDeckMode,
  deckInfo,
}: {
  setEditDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
  deckInfo: DeckInfo;
}) {
  const [deckFields, setDeckFields] = useState<DeckFields>({
    name: deckInfo.name,
    description: deckInfo.description,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEditDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditDeckMode(false);
  };

  const handleEditDeck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!deckFields.name.trim()) {
      alert("GraphDeck must have a name");
      return;
    }

    // Set loading state and close form immediately for better UX
    setIsEditing(true);
    setEditDeckMode(false);
    await editDeckInfo(deckInfo._id, deckFields);
  };

  return (
    <div className={`${styles.formContainer}`}>
      <DeckForm deckFields={deckFields} setDeckFields={setDeckFields} />
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
