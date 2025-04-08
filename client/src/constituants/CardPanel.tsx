import { ChangeEvent, useCallback, useState } from "react";
import { Card, CardFields, Deck, emptyCardFields } from "../Types/types";
import styles from "./CardPanel.module.scss";
import { deepCopy, dummy } from "../utils/utils";
import SelectRelatedCards from "../components/SelectRelatedCards";
import Xarrow from "react-xarrows";
import { X } from "lucide-react";

export default function CardPanel({
  selectedDeck,
  selectedCard,
  setShowCardPanel,
}: {
  selectedDeck: Deck;
  selectedCard: Card | null;
  setShowCardPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cards = selectedDeck.cards;
  const [cardFields, setCardFields] = useState<CardFields>(
    deepCopy<CardFields>(emptyCardFields)
  );

  const [relatedCards, setRelatedCards] = useState<Card[]>([]);

  const handleSelectRelatedCard = useCallback(
    (cardId: string) => {
      const alreadyRelatedCard = relatedCards.find(
        (card) => card._id === cardId
      );
      if (alreadyRelatedCard) return;

      const newRelatedCard = cards.find((card) => card._id === cardId);
      if (newRelatedCard) setRelatedCards([...relatedCards, newRelatedCard]);
    },
    [cards, relatedCards]
  );

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

  const handleUnselectRelatedCard = useCallback(
    (cardId: string) => {
      setRelatedCards(
        relatedCards.filter((relatedCard) => relatedCard._id !== cardId)
      );
    },
    [relatedCards]
  );

  return (
    <div className={styles.formContainer}>
      <div className={styles.fieldContainer}>
        <label htmlFor="word" className={`${styles.formLabel}`}>
          Title (front)
        </label>{" "}
        <br />
        <input
          type="text"
          id="word"
          name="word"
          onChange={handleFieldChange}
          value={cardFields.front}
          autoComplete="off"
          className={`${styles.formInput}`}
        ></input>
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="back" className={`${styles.formLabel}`}>
          Body (back)
        </label>
        <br />
        <textarea
          id="back"
          name="back"
          onChange={handleFieldChange}
          value={cardFields.back}
          autoComplete="off"
          className={`${styles.formTextArea}`}
        ></textarea>
      </div>
      <div
        className={`${styles.fieldContainer} ${styles.relatedCardsFieldContainer}`}
      >
        <label htmlFor="linkedCards" className={`${styles.formLabel}`}>
          Related Cards
        </label>{" "}
        <br />
        <SelectRelatedCards
          cards={cards}
          handleSelectRelatedCard={handleSelectRelatedCard}
        />
      </div>
      <div className={`${styles.relatedCardsContainer}`}>
        {relatedCards.map((relatedCard) => (
          <div
            key={relatedCard._id}
            className={`${styles.relatedCardContainer}`}
          >
            <div className={`${styles.relationsContainer}`}>
              <div className={`${styles.edgesContainer}`}>
                <div className={`${styles.toRelation}`}>
                  <div className={`${styles.toRelationBottom}`}>
                    <input
                      type="text"
                      className={`${styles.arrowLabel}`}
                    ></input>
                    <div
                      id={`from-${relatedCard._id}`}
                      className={`${styles.start}`}
                    ></div>
                    <div
                      id={`to-${relatedCard._id}`}
                      className={`${styles.end}`}
                    ></div>
                    <Xarrow
                      start={`from-${relatedCard._id}`}
                      end={`to-${relatedCard._id}`}
                      strokeWidth={1}
                      headSize={9}
                      color="black"
                    />
                  </div>
                </div>
                <div className={`${styles.fromRelation}`}>
                  <div className={`${styles.fromRelationTop}`}>
                    <input
                      type="text"
                      placeholder="to relatonship"
                      className={`${styles.arrowLabel}`}
                    ></input>
                    <div
                      id={`from2-${relatedCard._id}`}
                      className={`${styles.start}`}
                    ></div>
                    <div
                      id={`to2-${relatedCard._id}`}
                      className={`${styles.end}`}
                    ></div>
                    <Xarrow
                      start={`to2-${relatedCard._id}`}
                      end={`from2-${relatedCard._id}`}
                      strokeWidth={1}
                      headSize={9}
                      color="black"
                    />
                  </div>
                </div>
              </div>
              <div className={`${styles.checkboxContainer}`}>
                <input
                  type="checkbox"
                  className={`${styles.checkboxInput}`}
                  id={`checkbox-${relatedCard._id}`}
                />
                <label
                  className={`${styles.checkboxLabel}`}
                  htmlFor={`checkbox-${relatedCard._id}`}
                >
                  directed edges
                </label>
              </div>
            </div>
            <div className={`${styles.cardContainer}`}>
              <div className={`${styles.cardRepresentation}`}>
                <div
                  className={`${styles.xIconContainer}`}
                  onClick={() => handleUnselectRelatedCard(relatedCard._id)}
                >
                  <X size={13} />
                </div>
                <div className={`${styles.cardFrontContainer}`}>
                  {relatedCard.front}
                </div>
                <div className={`${styles.cardBackContainer}`}>
                  {relatedCard.back}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.formButtonsContainer}`}>
        <button onClick={dummy}>Create card</button>
      </div>
    </div>
  );
}
