import { AppCard } from "../Types/types";
import styles from "./CardEditContent.module.scss";
export default function CardEditContent({ cardData }: { cardData: AppCard }) {
  return (
    <div>
      <input
        className={`nodrag ${styles.frontInput}`}
        placeholder="title"
        value={cardData.front}
      ></input>
      <textarea
        className={`nodrag ${styles.backTextarea}`}
        placeholder="body"
        value={cardData.back}
      />
    </div>
  );
}
