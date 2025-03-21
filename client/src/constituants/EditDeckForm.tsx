import { useState } from "react";
import styles from "./EditDeckForm.module.scss";
import { DeckFormFields, DeckInfo } from "../Types/types";
import { useDispatch } from "react-redux";
import { rollbackDeckInfo, updateDeckInfo } from "../store/slices/deckSlice";
import Button from "../components/Button";
import { editDeckFormFieldsRequest } from "../services/api/decksApi";
import { deckFormFieldsFromDeckInfo, deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";

export default function EditDeckForm({
  setEditDeckMode,
  deckInfo,
}: {
  setEditDeckMode: React.Dispatch<React.SetStateAction<string | null>>;
  deckInfo: DeckInfo;
}) {
  const originalDeckFormFields = deepCopy(deckFormFieldsFromDeckInfo(deckInfo));
  const [deckFormFields, setDeckFormFields] = useState<DeckFormFields>(
    deepCopy(deckFormFieldsFromDeckInfo(deckInfo))
  );
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
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

    // Create optimistic deck info for immediate UI update
    const optimisticDeckInfo: DeckFormFields = {
      name: deckFormFields.name,
      description: deckFormFields.description,
    };
    console.log("optimisticDeckInfo, ", optimisticDeckInfo);
    // Update UI immediately
    dispatch(
      updateDeckInfo({
        deckId: deckInfo._id,
        newDeckFormFields: optimisticDeckInfo,
        oldDeckFormFields: originalDeckFormFields,
      })
    );

    // Then make the actual API request
    const triggerEditDeck = async () => {
      try {
        const newdeckFormFields: DeckFormFields = {
          ...deckFormFields,
        };

        const editedDeck = await editDeckFormFieldsRequest(
          deckInfo._id,
          newdeckFormFields
        );

        if (editedDeck) {
          // Careful here i am not putting the actual updated DB Deck in the store after success
          // no need because it s just 3 fields and they are exactly the same
          // Reset form state
        } else {
          // Handle error - remove the optimistic entry if the API call fails
          dispatch(rollbackDeckInfo());
          setEditDeckMode(deckInfo._id); // Reopen the form
          alert("Failed to edit deck. Please try again.");
        }
      } catch (error) {
        console.error("Error editing deck:", error);
        dispatch(rollbackDeckInfo());
        setEditDeckMode(deckInfo._id);
        alert("An error occurred while editing the deck");
      } finally {
        setIsEditing(false);
      }
    };

    triggerEditDeck();
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
