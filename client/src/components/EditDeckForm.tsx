import { useState } from "react";
import styles from "./EditDeckForm.module.scss";
import { DeckFields, DeckInfo } from "../Types/appDataTypes";
import Button from "../components/Button";
import DeckForm from "../components/DeckForm";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export default function EditDeckForm({
  setEditDeckMode,
  deckInfo,
}: {
  setEditDeckMode: React.Dispatch<React.SetStateAction<string | null>>;
  deckInfo: DeckInfo;
}) {
  const editDeckInfo = useGraphcardsStore(
    useShallow((state) => state.editDeckInfo)
  );
  const [deckFields, setDeckFields] = useState<DeckFields>({
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
    if (!deckFields.name.trim()) {
      alert("GraphDeck must have a name");
      return;
    }

    // Set loading state and close form immediately for better UX
    setIsEditing(true);
    setEditDeckMode(null);
    editDeckInfo(deckInfo._id, deckFields);
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
