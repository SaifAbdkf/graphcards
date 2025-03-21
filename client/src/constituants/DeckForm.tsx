import { ChangeEvent, useCallback, useState } from "react";
import styles from "./DeckForm.module.scss";
import {
  DeckBasicFields,
  DeckFields,
  emptyDeckBasicFields,
} from "../Types/types";
import { useDispatch } from "react-redux";
import { setActiveDeck } from "../store/slices/deckSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { createDeckRequest } from "../services/api/decksApi";

export default function DeckForm({
  deckId = null,
}: {
  deckId?: string | null;
}) {
  console.log("deckid from DeckForm is ", deckId);
  const [deckBasicFields, setDeckBasicFields] =
    useState<DeckBasicFields>(emptyDeckBasicFields);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.log("Hey I am here 😎");
      const deckFields: DeckFields = {
        ...deckBasicFields,
        cards: [],
      };
      const createdDeck = await createDeckRequest(deckFields);
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
          <Button onClick={handleBuildGraph}>Create GraphDeck</Button>
        </div>
      </div>
    </div>
  );
}
