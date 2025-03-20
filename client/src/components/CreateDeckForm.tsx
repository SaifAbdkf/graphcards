export default function CreateDeckForm() {
  return (
    <div
      className={`${styles.deckRepresentation} ${styles.addDeck}  ${styles.addDeckNoHover}`}
    >
      <div className={`${styles.formContainer} ${styles.jumpAnimation}`}>
        <div>
          <input
            placeholder={"name"}
            name="deckName"
            className={styles.deckName}
            value={deckBasicFields.name}
            onChange={handleFieldChange}
          ></input>
        </div>
        <div>
          <textarea
            placeholder={"decsription"}
            name={"deckDescription"}
            className={styles.deckDescription}
            value={deckBasicFields.description}
            onChange={handleFieldChange}
          ></textarea>
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.generateButtonContainer}>
            <Button
              bgColorClass="bg-neutral"
              fontSizeClass="small-font-size"
              onClick={dummy}
            >
              Generate graph from file (gpt logo)
            </Button>
          </div>
          <div>or </div>
          <div className={styles.scratchButtonContainer}>
            <Button
              bgColorClass="bg-neutral"
              fontSizeClass="small-font-size"
              onClick={handleBuildGraph}
            >
              add card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
