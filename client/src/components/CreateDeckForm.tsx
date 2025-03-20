import { ChangeEvent, useCallback, useState } from "react";
import styles from "./CreateDeckForm.module.scss";
import {
  DeckBasicFields,
  DeckFields,
  emptyDeckBasicFields,
} from "../Types/types";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { createDeck } from "../services/api/decksApi";
import { setActiveDeck } from "../store/slices/deckSlice";
import { useNavigate } from "react-router-dom";
import { dummy } from "../utils/utils";

export default function CreateDeckForm() {
  const [deckBasicFields, setDeckBasicFields] =
    useState<DeckBasicFields>(emptyDeckBasicFields);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log("a");
      const { name, value } = e.target;
      const newDeckFieldsBasic = { ...deckBasicFields };
      switch (name) {
        case "deckName":
          newDeckFieldsBasic.name = value;
          setDeckBasicFields(newDeckFieldsBasic);
          break;
        case "deckDescription":
          newDeckFieldsBasic.description = value;
          setDeckBasicFields(newDeckFieldsBasic);
          break;
        default:
          throw new Error(`Unhandled field name ${value}`);
      }
    },
    [deckBasicFields]
  );

  const handleBuildGraph = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("b");

    e.preventDefault();
    const triggerCreateDeck = async () => {
      const deckFields: DeckFields = {
        ...deckBasicFields,
        cards: [],
      };
      const createdDeck = await createDeck(deckFields);
      if (createdDeck) {
        dispatch(setActiveDeck(createdDeck));
        navigate("/playground");
      }
    };

    triggerCreateDeck();
  };
  return (
    <div className={`${styles.formContainer}`}>
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
        <div className={styles.scratchButtonContainer}>
          <button onClick={handleBuildGraph}>Create GraphDeck</button>
        </div>
      </div>
    </div>
  );
}
