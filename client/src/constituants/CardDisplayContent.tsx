import { AppCard } from "../Types/types";
import styles from "./CardDisplayContent.module.scss";

export default function CardDisplayContent({
  cardData,
}: {
  cardData: AppCard;
}) {
  return (
    <div>
      <h3 className={`${styles.front}`}>{cardData.front}</h3>
      <p className={`${styles.back}`}>{cardData.back}</p>
    </div>
  );
}
