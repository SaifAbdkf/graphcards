import { ChangeEvent, useCallback, useState } from "react";
import { CardFields, Deck, DeckBasicFields, DeckFields } from "../Types/types";
import { BACKEND_URL } from "../services/api/apiRequestMethods";
import { deckBasicFieldsFromDeck } from "../utils/utils";

export default function DeckPanel({
  activeDeck,
  setShowDeckPanel,
}: {
  activeDeck: Deck;
  setShowCardPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deckBasicFields, setDeckBasicFields] = useState<DeckBasicFields>(
    deckBasicFieldsFromDeck(activeDeck)
  );
  const activeDeckId = activeDeck._id;

  const updateDeck = async (id: string, deckFields: DeckFields) => {
    const response = await fetch(`${BACKEND_URL}/api/card/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(deckFields),
    });

    if (!response.ok) {
      throw new Error("could not update card");
    }
  };

  const deleteDeck = async (id: string) => {
    const response = await fetch(`${BACKEND_URL}/api/deck/${id}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("could not delete card");
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (cardToEditId) {
      updateCard(cardToEditId, cardFields);
    } else {
      createCard(cardFields);
    }
    setShowCardPanel(false);
  };

  const handleFieldChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      const newCardFields = { ...cardFields };
      switch (name) {
        case "word":
          newCardFields.front = value;
          setCardFields(newCardFields);
          break;
        case "back":
          newCardFields.back = value;
          setCardFields(newCardFields);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [cardFields]
  );

  return (
    <div className={styles.formContainer}>
      <form>
        <div className={styles.fieldContainer}>
          <label htmlFor="word">Word</label>
          <input
            type="text"
            id="word"
            name="word"
            placeholder="word"
            onChange={handleFieldChange}
            value={cardFields.front}
            className={styles.rtl}
          ></input>
        </div>
        <div className={styles.fieldContainer}>
          <label htmlFor="back">Back</label>
          <input
            type="text"
            id="back"
            name="back"
            placeholder="back"
            onChange={handleFieldChange}
            value={cardFields.back}
            // className={styles.rtl}
          ></input>
        </div>
        <div className={styles.fieldContainer}>
          <label htmlFor="linkedCards">Linked Cards</label>

          <select name="linkedCards">
            <option value="option1">option1</option>
            <option value="option2">option2</option>
            <option value="option3">option3</option>
          </select>
        </div>
        <div
          className={`${styles.fieldContainer} ${styles.linkedCardsFieldContainer} `}
        >
          <label htmlFor="linkedCards"></label>
          <div className={styles.linkedCardsBox}></div>
        </div>
        <div className={`${styles.formButtonsContainer}`}>
          <button onClick={handleSubmit}>
            {cardToEdit ? "Save Card" : "Create card"}
          </button>
          {cardToEdit && <button onClick={dummy}>Delete Card </button>}
        </div>
      </form>
    </div>
  );
}
