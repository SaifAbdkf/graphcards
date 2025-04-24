import { ChangeEvent, useCallback, useState } from "react";
import { Card, CardFields, Deck, emptyCardFields } from "../Types/types";
import styles from "./CardPanel.module.scss";
import { deepCopy } from "../utils/utils";
import SelectRelatedCards from "../components/SelectRelatedCards";
import Xarrow from "react-xarrows";
import { X } from "lucide-react";
import { KeyedMutator } from "swr";
import RelatedCardEdge from "./RelatedCardEdge";

type EdgeFields = {
  direction: "undirected" | "fromNewCard" | "toNewCard";
  label?: string;
};

export type RelatedCardInfo = {
  card: Card;
  edge: EdgeFields;
};

export default function CardPanel({
  deck,
  mutateDeck,
  setShowCardPanel,
}: {
  deck: Deck;
  mutateDeck: KeyedMutator<Deck>;
  setShowCardPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cards = deck.cards;

  const [cardFields, setCardFields] = useState<CardFields>(
    deepCopy<CardFields>(emptyCardFields)
  );

  const [relatedCardsInfo, setRelatedCardsInfo] = useState<RelatedCardInfo[]>(
    []
  );

  console.log(relatedCardsInfo);

  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSelectRelatedCard = useCallback(
    (cardId: string) => {
      const alreadyRelatedCard = relatedCardsInfo.find(
        (relatedCardInfo) => relatedCardInfo.card._id === cardId
      );
      if (alreadyRelatedCard) return;

      const newRelatedCard = cards.find((card) => card._id === cardId);
      if (newRelatedCard)
        setRelatedCardsInfo([
          ...relatedCardsInfo,
          {
            card: newRelatedCard,
            edge: {
              direction: "undirected",
            },
          },
        ]);
    },
    [cards, relatedCardsInfo]
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
      setRelatedCardsInfo(
        relatedCardsInfo.filter(
          (relatedCardInfo) => relatedCardInfo.card._id !== cardId
        )
      );
    },
    [relatedCardsInfo]
  );

  const handleCreateCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Validate form fields
    if (!cardFields.front.trim()) {
      alert("Please enter a title for your card");
      return;
    }
    if (!cardFields.back.trim()) {
      alert("Please enter a body for your card");
      return;
    }
    if (relatedCardsInfo.length === 0) {
      alert("Please select at least one related card");
      return;
    }
    // Set loading state (isCreating) and close form immediately for better UX
    setIsCreatingCard(true);
    setShowCardPanel(false);

    const optimisticCard: Card = {
      ...cardFields,
      deckId: deck._id,
      _id: Date.now().toString(),
    };
    const optimisticDeck = { ...deck, cards: [...deck.cards, optimisticCard] };
    const options = {
      optimisticData: optimisticDeck,
      rollbackOnError: true,
    };

    // mutateDeck(async () => {
    //   await
    // }, options);
  };
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
        {relatedCardsInfo.map((relatedCardInfo) => (
          <div
            key={relatedCardInfo.card._id}
            className={`${styles.relatedCardContainer}`}
          >
            <RelatedCardEdge
              relatedCardInfo={relatedCardInfo}
              relatedCardsInfo={relatedCardsInfo}
              setRelatedCardsInfo={setRelatedCardsInfo}
            />

            <div className={`${styles.cardContainer}`}>
              <div className={`${styles.cardRepresentation}`}>
                <div
                  className={`${styles.xIconContainer}`}
                  onClick={() =>
                    handleUnselectRelatedCard(relatedCardInfo.card._id)
                  }
                >
                  <X size={13} />
                </div>
                <div className={`${styles.cardFrontContainer}`}>
                  {relatedCardInfo.card.front}
                </div>
                <div className={`${styles.cardBackContainer}`}>
                  {relatedCardInfo.card.back}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.formButtonsContainer}`}>
        <button onClick={handleCreateCard}>Create card</button>
      </div>
    </div>
  );
}
