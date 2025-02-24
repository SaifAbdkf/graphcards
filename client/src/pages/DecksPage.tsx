import Button from "../components/Button";
import styles from "./DecksPage.module.scss";
import { useState } from "react";

export default function DecksPage({ location }: { location: string }) {
  const [createDeckMode, setCreateDeckMode] = useState<boolean>(false);
  const decks = [
    { name: "tunisian", numCards: 500 },
    { name: "french", numCards: 0 },
    { name: "computer science", numCards: 1 },
    { name: "Philosophy", numCards: 10 },
  ];
  console.log("location is: ", location);

  return (
    <div className={styles.decksPageContainer}>
      <h1>My Graph Decks</h1>
      <div className={styles.decksList}>
        {!createDeckMode ? (
          <div
            onClick={() => setCreateDeckMode(true)}
            className={`${styles.deckRepresentation} ${styles.addDeck}`}
          >
            <span>create a new Deck</span>
          </div>
        ) : (
          <div
            className={`${styles.deckRepresentation} ${styles.addDeck}  ${styles.addDeckNoHover}`}
          >
            <div className={`${styles.formContainer} ${styles.jumpAnimation}`}>
              <div>
                <input
                  placeholder={"deck name"}
                  className={styles.deckName}
                ></input>
              </div>
              <div>
                <textarea
                  placeholder={"deck decsription"}
                  className={styles.deckDescription}
                ></textarea>
              </div>
              <div className={styles.buttonsContainer}>
                <div className={styles.generateButtonContainer}>
                  <Button
                    bgColorClass="bg-neutral"
                    fontSizeClass="small-font-size"
                  >
                    Generate graph from file (gpt logo)
                  </Button>
                </div>
                <div>or </div>
                <div className={styles.scratchButtonContainer}>
                  <Button
                    bgColorClass="bg-neutral"
                    fontSizeClass="small-font-size"
                  >
                    Build Graph from scratch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {decks.map((deck) => (
          <>
            <div key={deck.name} className={styles.deckRepresentation}>
              <span>{deck.name}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
