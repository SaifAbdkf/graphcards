import { ChangeEvent, useCallback, useEffect, useState } from "react";
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

  const [localFront, setLocalFront] = useState(cardData.front);
  const [localBack, setLocalBack] = useState(cardData.back);
  const [localLeitnerBox, setLocalLeitnerBox] = useState(cardData.leitnerBox);

  useEffect(() => {
    setLocalFront(cardData.front);
    setLocalBack(cardData.back);
  }, [cardData.front, cardData.back]);

  const updateCardData = useCallback(
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
        leitnerBox:
          name === "leitnerBox" ? parseInt(value) : cardData.leitnerBox,
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
      cardData.leitnerBox,
    ]
  );

  return (
    <div>
      <input
        name="front"
        className={`nodrag ${styles.frontInput}`}
        placeholder="title"
        onChange={(e) => setLocalFront(e.target.value)}
        onBlur={updateCardData}
        value={localFront}
        autoComplete="off"
      />
      <textarea
        name="back"
        className={`nodrag ${styles.backTextarea}`}
        placeholder="body"
        onChange={(e) => setLocalBack(e.target.value)}
        onBlur={updateCardData}
        value={localBack}
      />
      <input
        placeholder="leitner box"
        type="number"
        name="leitnerBox"
        onChange={(e) => setLocalLeitnerBox(parseInt(e.target.value))}
        value={localLeitnerBox}
      ></input>
    </div>
  );
}
