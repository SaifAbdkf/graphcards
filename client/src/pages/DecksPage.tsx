import styles from "./DecksPage.module.scss";

export default function DecksPage() {
  const decks = [
    { name: "tunisian", numCards: 500 },
    { name: "french", numCards: 0 },
    { name: "computer science", numCards: 1 },
    { name: "Philosophy", numCards: 10 },
  ];
  return (
    <div className={styles.decksPageContainer}>
      <h1>My Decks</h1>
      <div className={styles.decksList}>
        <div className={styles.deckRepresentation}> create a new Deck </div>

        {decks.map((deck) => (
          <div className={styles.deckRepresentation}> {deck.name} </div>
        ))}
      </div>
    </div>
  );
}
