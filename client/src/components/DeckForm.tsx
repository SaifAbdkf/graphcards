import { ChangeEvent, useCallback } from "react";
import { DeckFormFields } from "../Types/types";
import styles from "./DeckForm.module.scss";

export default function DeckForm({
  deckFormFields,
  setDeckFormFields,
}: {
  deckFormFields: DeckFormFields;
  setDeckFormFields: React.Dispatch<React.SetStateAction<DeckFormFields>>;
}) {
  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newDeckFieldsBasic = { ...deckFormFields };
      switch (name) {
        case "deckName":
          newDeckFieldsBasic.name = value;
          setDeckFormFields(newDeckFieldsBasic);
          break;
        case "deckDescription":
          newDeckFieldsBasic.description = value;
          setDeckFormFields(newDeckFieldsBasic);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [deckFormFields, setDeckFormFields]
  );
  return (
    <div>
      <div>
        <input
          placeholder={"name"}
          name="deckName"
          className={styles.deckName}
          value={deckFormFields.name}
          onChange={handleFieldChange}
          autoComplete="off"
        ></input>
      </div>
      <div>
        <textarea
          placeholder={"decsription"}
          name={"deckDescription"}
          className={styles.deckDescription}
          value={deckFormFields.description}
          onChange={handleFieldChange}
          autoComplete="off"
        ></textarea>
      </div>
    </div>
  );
}
