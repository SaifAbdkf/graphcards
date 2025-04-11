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

  type EdgesLabels = {
    isDirected: boolean;
    selectedToRelatedLabel: string | null;
    relatedToSelectedLabel: string | null;
    undirectedLabel: string | null;
  };

  type RelatedCardInfo = {
    card: Card;
    edgesLabels: EdgesLabels;
  };

  const [relatedCardsInfo, setRelatedCardsInfo] = useState<RelatedCardInfo[]>(
    []
  );
  console.log(relatedCardsInfo);

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
            edgesLabels: {
              isDirected: false,
              selectedToRelatedLabel: null,
              relatedToSelectedLabel: null,
              undirectedLabel: null,
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

  const handleEdgeLabelChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, cardId: string) => {
      const { name, value } = e.target;

      const newRelatedCardsInfo = relatedCardsInfo.map((cardInfo) =>
        cardInfo.card._id === cardId
          ? {
              ...cardInfo,
              edgesLabels: {
                ...cardInfo.edgesLabels,
                [name]: value, //HOW TO DO THS
              },
            }
          : cardInfo
      );
      setRelatedCardsInfo(newRelatedCardsInfo);
    },
    [relatedCardsInfo]
  );

  const handleCheckboxChange = useCallback(
    (cardId: string) => {
      console.log("asba");
      const newRelatedCardsInfo = relatedCardsInfo.map((cardInfo) =>
        cardInfo.card._id === cardId
          ? {
              ...cardInfo,
              edgesLabels: {
                isDirected: !cardInfo.edgesLabels.isDirected,
                selectedToRelatedLabel: null,
                relatedToSelectedLabel: null,
                undirectedLabel: null,
              },
            }
          : cardInfo
      );
      setRelatedCardsInfo(newRelatedCardsInfo);
    },
    [relatedCardsInfo]
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
        {relatedCardsInfo.map((relatedCardInfo) => (
          <div
            key={relatedCardInfo.card._id}
            className={`${styles.relatedCardContainer}`}
          >
            <div className={`${styles.edgesContainer}`}>
              {relatedCardInfo.edgesLabels.isDirected ? (
                <>
                  <div className={`${styles.toRelation}`}>
                    <input
                      type="text"
                      className={`${styles.arrowLabel}`}
                      name="selectedToRelatedLabel"
                      value={
                        relatedCardInfo.edgesLabels.selectedToRelatedLabel || ""
                      }
                      onChange={(e) =>
                        handleEdgeLabelChange(e, relatedCardInfo.card._id)
                      }
                    ></input>
                    <div
                      id={`from-${relatedCardInfo.card._id}`}
                      className={`${styles.start}`}
                    ></div>
                    <div
                      id={`to-${relatedCardInfo.card._id}`}
                      className={`${styles.end}`}
                    ></div>
                    <Xarrow
                      start={`from-${relatedCardInfo.card._id}`}
                      end={`to-${relatedCardInfo.card._id}`}
                      strokeWidth={1}
                      headSize={9}
                      color="black"
                    />
                  </div>
                  <div className={`${styles.fromRelation}`}>
                    <input
                      type="text"
                      placeholder=""
                      className={`${styles.arrowLabel}`}
                      name="relatedToSelectedLabel"
                      value={
                        relatedCardInfo.edgesLabels.relatedToSelectedLabel || ""
                      }
                      onChange={(e) =>
                        handleEdgeLabelChange(e, relatedCardInfo.card._id)
                      }
                    ></input>
                    <div
                      id={`from2-${relatedCardInfo.card._id}`}
                      className={`${styles.start}`}
                    ></div>
                    <div
                      id={`to2-${relatedCardInfo.card._id}`}
                      className={`${styles.end}`}
                    ></div>
                    <Xarrow
                      start={`to2-${relatedCardInfo.card._id}`}
                      end={`from2-${relatedCardInfo.card._id}`}
                      strokeWidth={1}
                      headSize={9}
                      color="black"
                    />
                  </div>
                </>
              ) : (
                <div className={`${styles.fromRelation}`}>
                  <input
                    type="text"
                    className={`${styles.arrowLabel}`}
                    name="undirectedLabel"
                    value={relatedCardInfo.edgesLabels.undirectedLabel || ""}
                    onChange={(e) =>
                      handleEdgeLabelChange(e, relatedCardInfo.card._id)
                    }
                  ></input>
                  <div
                    id={`from2-${relatedCardInfo.card._id}`}
                    className={`${styles.start}`}
                  ></div>
                  <div
                    id={`to2-${relatedCardInfo.card._id}`}
                    className={`${styles.end}`}
                  ></div>
                  <Xarrow
                    start={`to2-${relatedCardInfo.card._id}`}
                    end={`from2-${relatedCardInfo.card._id}`}
                    strokeWidth={1}
                    headSize={0}
                    color="black"
                  />
                </div>
              )}
              <div className={`${styles.checkboxContainer}`}>
                <input
                  type="checkbox"
                  className={`${styles.checkboxInput}`}
                  id={`checkbox-${relatedCardInfo.card._id}`}
                  checked={relatedCardInfo.edgesLabels.isDirected}
                  onChange={() =>
                    handleCheckboxChange(relatedCardInfo.card._id)
                  }
                />
                <label
                  className={`${styles.checkboxLabel}`}
                  htmlFor={`checkbox-${relatedCardInfo.card._id}`}
                >
                  directed edges
                </label>
              </div>
            </div>

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
        <button onClick={dummy}>Create card</button>
      </div>
    </div>
  );
}
