import { useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import {
  DeckFields,
  DeckFormFields,
  DeckInfo,
  emptyDeckFormFields,
} from "../Types/types";
import { useDispatch } from "react-redux";
import { addDeckInfo, removeDeckInfo } from "../store/slices/deckSlice";
import Button from "../components/Button";
import { createDeckRequest } from "../services/api/decksApi";
import { deckInfoFromDeck, deepCopy } from "../utils/utils";
import DeckForm from "../components/DeckForm";

export default function CreateDeckForm({
  setCreateDeckMode,
}: {
  setCreateDeckMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deckFormFields, setDeckFormFields] = useState<DeckFormFields>(
    deepCopy(emptyDeckFormFields)
  );
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch();
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

    // Set loading state and close form immediately for better UX
    setIsCreating(true);
    setCreateDeckMode(false);

    // Create optimistic deck info for immediate UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticDeckInfo: DeckInfo = {
      _id: tempId,
      name: deckFormFields.name,
      description: deckFormFields.description,
    };

    // Update UI immediately
    dispatch(addDeckInfo(optimisticDeckInfo));

    // Then make the actual API request
    const triggerCreateDeck = async () => {
      try {
        const deckFields: DeckFields = {
          ...deckFormFields,
          cards: [],
        };

        const createdDeck = await createDeckRequest(deckFields);

        if (createdDeck) {
          // Replace the optimistic deck with the real one
          const newDeck: DeckInfo = deckInfoFromDeck(createdDeck);
          // Remove the temporary deck
          dispatch(removeDeckInfo(tempId));
          // Add the real deck from the server
          dispatch(addDeckInfo(newDeck));

          // Reset form state
          setDeckFormFields(deepCopy<DeckFormFields>(emptyDeckFormFields));
        } else {
          // Handle error - remove the optimistic entry if the API call fails
          dispatch(removeDeckInfo(tempId));
          setCreateDeckMode(true); // Reopen the form
          alert("Failed to create deck. Please try again.");
        }
      } catch (error) {
        console.error("Error creating deck:", error);
        dispatch(removeDeckInfo(tempId));
        setCreateDeckMode(true);
        alert("An error occurred while creating the deck");
      } finally {
        setIsCreating(false);
      }
    };

    triggerCreateDeck();
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
        <Button onClick={handleCreateDeck} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
