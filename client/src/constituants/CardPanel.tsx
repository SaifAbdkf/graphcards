import { ChangeEvent, useCallback, useState } from "react";
import {
  Card,
  CardFields,
  Deck,
  emptyCardFields,
  emptyLinkFields,
  LinkFields,
} from "../Types/types";
import styles from "./CardPanel.module.scss";
import { deepCopy } from "../utils/utils";
import SelectLinkedCards from "../components/SelectLinkedCards";
import { X } from "lucide-react";
import { KeyedMutator } from "swr";
import { createConnectedCardRequest } from "../services/api/cardRequests";
import { fetchDeck } from "../services/api/deckRequests";
import LinkedCardForm from "./LinkedCardForm";

export type LinkedCardFields = {
  card: Card;
  link: LinkFields;
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

  const [linkedCardsFields, setLinkedCardsFields] = useState<
    LinkedCardFields[]
  >([]);

  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const handleSelectLinkedCard = useCallback(
    (cardId: string) => {
      const alreadyLinkedCard = linkedCardsFields.find(
        (linkedCardFields) => linkedCardFields.card._id === cardId
      );
      if (alreadyLinkedCard) return;

      const foundLinkedCard = cards.find((card) => card._id === cardId);
      if (foundLinkedCard)
        setLinkedCardsFields([
          ...linkedCardsFields,
          {
            card: foundLinkedCard,
            link: { ...emptyLinkFields, to: foundLinkedCard._id },
          },
        ]);
    },
    [cards, linkedCardsFields]
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

  const handleUnselectLinkedCard = useCallback(
    (cardId: string) => {
      setLinkedCardsFields(
        linkedCardsFields.filter(
          (linkedCardFields) => linkedCardFields.card._id !== cardId
        )
      );
    },
    [linkedCardsFields]
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
    setShowCardPanel(false);

    const optimisticCard: Card = {
      ...cardFields,
      x: 0,
      y: 0,
      deckId: deck._id,
      _id: Date.now().toString(),
    };

    const optimisticLinks = linkedCardsFields.map((linkedCard, index) => ({
      ...linkedCard.link,
      deckId: deck._id,
      _id: (Date.now() + index).toString(),
    }));

    const optimisticDeck = {
      ...deck,
      cards: [...deck.cards, optimisticCard],
      links: [...deck.links, ...optimisticLinks],
    };
    const options = {
      optimisticData: optimisticDeck,
      rollbackOnError: true,
    };

    const linksFields = linkedCardsFields.map(
      (linkedCardFields) => linkedCardFields.link
    );

    mutateDeck(async () => {
      await createConnectedCardRequest(deck._id, cardFields, linksFields);
      const updatedDeck = await fetchDeck(deck._id);
      return updatedDeck;
    }, options);
  };

  const updatelinkedCardFields = (newLinkedCard: LinkedCardFields) => {
    const newLinkedCardsFields: LinkedCardFields[] = linkedCardsFields.map(
      (cardFields) =>
        cardFields.card._id === newLinkedCard.card._id
          ? newLinkedCard
          : cardFields
    );
    setLinkedCardsFields(newLinkedCardsFields);
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
        className={`${styles.fieldContainer} ${styles.linkedCardsFieldContainer}`}
      >
        <label htmlFor="linkedCards" className={`${styles.formLabel}`}>
          Linked Cards
        </label>{" "}
        <br />
        <SelectLinkedCards
          cards={cards}
          handleSelectLinkedCard={handleSelectLinkedCard}
        />
      </div>
      <div className={`${styles.linkedCardsContainer}`}>
        {linkedCardsFields.map((linkedCardFields) => (
          <div
            key={linkedCardFields.card._id}
            className={`${styles.linkedCardContainer}`}
          >
            <LinkedCardForm
              linkedCardFields={linkedCardFields}
              handleLinkedCardFieldsChange={updatelinkedCardFields}
            />

            <div className={`${styles.cardContainer}`}>
              <div className={`${styles.cardRepresentation}`}>
                <div
                  className={`${styles.xIconContainer}`}
                  onClick={() =>
                    handleUnselectLinkedCard(linkedCardFields.card._id)
                  }
                >
                  <X size={13} />
                </div>
                <div className={`${styles.cardFrontContainer}`}>
                  {linkedCardFields.card.front}
                </div>
                <div className={`${styles.cardBackContainer}`}>
                  {linkedCardFields.card.back}
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
