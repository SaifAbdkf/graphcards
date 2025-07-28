import { ChangeEvent, useCallback } from "react";
import { DeckFields } from "../Types/appDataTypes";
import styles from "./DeckForm.module.scss";

export default function DeckForm({
  deckFields,
  setDeckFields,
}: {
  deckFields: DeckFields;
  setDeckFields: React.Dispatch<React.SetStateAction<DeckFields>>;
}) {
  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newDeckFieldsBasic = { ...deckFields };
      switch (name) {
        case "deckName":
          newDeckFieldsBasic.name = value;
          setDeckFields(newDeckFieldsBasic);
          break;
        case "deckDescription":
          newDeckFieldsBasic.description = value;
          setDeckFields(newDeckFieldsBasic);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [deckFields, setDeckFields]
  );
  return (
    <div>
      <div>
        <input
          placeholder={"name"}
          name="deckName"
          className={styles.deckName}
          value={deckFields.name}
          onChange={handleFieldChange}
          autoComplete="off"
        ></input>
      </div>
      <div>
        <textarea
          placeholder={"decsription"}
          name={"deckDescription"}
          className={styles.deckDescription}
          value={deckFields.description}
          onChange={handleFieldChange}
          autoComplete="off"
        ></textarea>
      </div>
    </div>
  );
}
