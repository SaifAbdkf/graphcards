import { Link } from "react-router-dom";
import styles from "./DecksPage.module.scss";

export default function DecksPage({ location }: { location: string }) {
  const createDeckMode = location === "/decks/create";
  const decks = [
    { name: "tunisian", numCards: 500 },
    { name: "french", numCards: 0 },
    { name: "computer science", numCards: 1 },
    { name: "Philosophy", numCards: 10 },
  ];
  console.log("location is: ", location);

  return (
    <div className={styles.decksPageContainer}>
      <h1>My Decks</h1>
      <div className={styles.decksList}>
        <Link to="create" className={`${styles.createDeckLink}`}>
          <div className={`${styles.deckRepresentation} ${styles.addDeck}`}>
            <span>create a new Deck</span>
          </div>
        </Link>
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
