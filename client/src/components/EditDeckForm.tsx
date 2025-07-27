import styles from "./EditDeckForm.module.scss";
import { DeckFields } from "../Types/appDataTypes";
import DeckForm from "./DeckForm";

export default function EditDeckForm({
  deckFields,
  setDeckFields,
}: {
  deckFields: DeckFields;
  setDeckFields: React.Dispatch<React.SetStateAction<DeckFields>>;
}) {
  return (
    <div className={`${styles.formContainer}`}>
      <DeckForm deckFields={deckFields} setDeckFields={setDeckFields} />
    </div>
  );
}
