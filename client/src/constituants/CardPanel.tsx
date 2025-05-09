import { ChangeEvent, useCallback, useState } from "react";
import {
  Card,
  CardFields,
  Deck,
  EdgeFields,
  emptyCardFields,
  emptyEdgeFields,
} from "../Types/types";
import styles from "./CardPanel.module.scss";
import { deepCopy } from "../utils/utils";
import SelectRelatedCards from "../components/SelectRelatedCards";
import { X } from "lucide-react";
import { KeyedMutator } from "swr";
import RelatedCardEdge from "./RelatedCardEdge";
import { createConnectedCardRequest } from "../services/api/cardRequests";
import { fetchDeck } from "../services/api/deckRequests";

export type RelatedCardFields = {
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

  const [relatedCardsFields, setRelatedCardsFields] = useState<
    RelatedCardFields[]
  >([]);

  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSelectRelatedCard = useCallback(
    (cardId: string) => {
      const alreadyRelatedCard = relatedCardsFields.find(
        (relatedCardFields) => relatedCardFields.card._id === cardId
      );
      if (alreadyRelatedCard) return;

      const newRelatedCard = cards.find((card) => card._id === cardId);
      if (newRelatedCard)
        setRelatedCardsFields([
          ...relatedCardsFields,
          {
            card: newRelatedCard,
            edge: { ...emptyEdgeFields, to: newRelatedCard._id },
          },
        ]);
    },
    [cards, relatedCardsFields]
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
      setRelatedCardsFields(
        relatedCardsFields.filter(
          (relatedCardFields) => relatedCardFields.card._id !== cardId
        )
      );
    },
    [relatedCardsFields]
  );

  const handleCreateCard = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

    // Set loading state (isCreating) and close form immediately for better UX
    setIsCreatingCard(true);
    // setShowCardPanel(false);

    const optimisticCard: Card = {
      ...cardFields,
      deckId: deck._id,
      _id: Date.now().toString(),
    };

    const optimisticEdges = relatedCardsFields.map((relatedCard) => ({
      linkedCardId: relatedCard.card._id,
      ...relatedCard.edge,
    }));

    const optimisticDeck = {
      ...deck,
      cards: [...deck.cards, optimisticCard],
      edges: [...deck.edges, ...optimisticEdges],
    };
    const options = {
      optimisticData: optimisticDeck,
      rollbackOnError: true,
    };

    mutateDeck(async () => {
      await createConnectedCardRequest(
        deck._id,
        cardFields,
        relatedCardsFields
      );
      const updatedDeck = await fetchDeck(deck._id);
      return updatedDeck;
    }, options);
  };

  const updateRelatedCardFields = (newRelatedCard: RelatedCardFields) => {
    const newRelatedCardsFields: RelatedCardFields[] = relatedCardsFields.map(
      (cardFields) =>
        cardFields.card._id === newRelatedCard.card._id
          ? newRelatedCard
          : cardFields
    );
    setRelatedCardsFields(newRelatedCardsFields);
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
        {relatedCardsFields.map((relatedCardFields) => (
          <div
            key={relatedCardFields.card._id}
            className={`${styles.relatedCardContainer}`}
          >
            <RelatedCardEdge
              relatedCardFields={relatedCardFields}
              handleRelatedCardFieldsChange={updateRelatedCardFields}
            />

            <div className={`${styles.cardContainer}`}>
              <div className={`${styles.cardRepresentation}`}>
                <div
                  className={`${styles.xIconContainer}`}
                  onClick={() =>
                    handleUnselectRelatedCard(relatedCardFields.card._id)
                  }
                >
                  <X size={13} />
                </div>
                <div className={`${styles.cardFrontContainer}`}>
                  {relatedCardFields.card.front}
                </div>
                <div className={`${styles.cardBackContainer}`}>
                  {relatedCardFields.card.back}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.formButtonsContainer}`}>
        <button onClick={handleCreateCard} disabled={isCreatingCard}>
          Create card
        </button>
      </div>
    </div>
  );
}
