import { ChangeEvent, useCallback, useState } from "react";
import { Card, CardFields, emptyCardFields } from "../Types/types";
import { deepCopy } from "../utils/deepCopy";
import styles from "./cardLab.module.scss";
import { BACKEND_URL } from "../services/api/apiRequestMethods";
import { dummy } from "../utils/utils";

export default function CardLab({
  cardToEdit,
  setShowCardLab,
}: {
  cardToEdit: Card | null;
  setShowCardLab: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [cardFields, setCardFields] = useState<CardFields>(
    deepCopy<CardFields>(emptyCardFields)
  );

  let cardToEditId: string | null = null;
  if (cardToEdit) {
    const { _id, ...cardToEditFields } = cardToEdit;
    cardToEditId = _id;
    setCardFields(cardToEditFields);
  }

  const updateCard = async (id: string, cardFields: CardFields) => {
    const response = await fetch(`${BACKEND_URL}/api/card/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(cardFields),
    });

    if (!response.ok) {
      throw new Error("could not update card");
    }
  };

  const createCard = async (cardFields: CardFields) => {
    const response = await fetch(`${BACKEND_URL}/card`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(cardFields),
    });

    if (!response.ok) {
      throw new Error("could not create card");
    }
  };

  // const deleteCard = async (id: string) => {
  //   const response = await fetch(`${BACKEND_URL}/api/card/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "content-Type": "application/json",
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error("could not delete card");
  //   }
  // };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (cardToEditId) {
      updateCard(cardToEditId, cardFields);
    } else {
      createCard(cardFields);
    }
    setShowCardLab(false);
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
    <div className={`${styles.cardLabContainer} ${styles.jumpAnimation}`}>
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
          <div className={`${styles.fieldContainer} ${styles.boxContainer} `}>
            <label htmlFor="linkedCards"></label>
            <div className={styles.linkedCardsBox}></div>
          </div>

          <>
            <button onClick={handleSubmit}>
              {cardToEdit ? "Save Card" : "Create card"}
            </button>
            {cardToEdit && <button onClick={dummy}>Delete Card </button>}
          </>
        </form>
      </div>
    </div>
  );
}
