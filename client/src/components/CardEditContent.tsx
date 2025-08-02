import { ChangeEvent, useCallback } from "react";
import { AppCard } from "../Types/appDataTypes";
import { useGraphcardsStore } from "../store/store";
import styles from "./CardEditContent.module.scss";
import { useShallow } from "zustand/shallow";

export default function CardEditContent({ cardData }: { cardData: AppCard }) {
  const { editNodeCardFields } = useGraphcardsStore(
    useShallow((state) => ({
      editNodeCardFields: state.editNodeCardFields,
    }))
  );

  const handleFieldChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      editNodeCardFields(cardData._id, {
        deckId: cardData.deckId,
        front: name === "front" ? value : cardData.front,
        back: name === "back" ? value : cardData.back,
        x: cardData.x,
        y: cardData.y,
      });
    },
    [
      editNodeCardFields,
      cardData._id,
      cardData.deckId,
      cardData.front,
      cardData.back,
      cardData.x,
      cardData.y,
    ]
  );

  return (
    <div>
      <input
        name="front"
        className={`nodrag ${styles.frontInput}`}
        placeholder="title"
        onChange={handleFieldChange}
        value={cardData.front}
      />
      <textarea
        name="back"
        className={`nodrag ${styles.backTextarea}`}
        placeholder="body"
        onChange={handleFieldChange}
        value={cardData.back}
      />
    </div>
  );
}
