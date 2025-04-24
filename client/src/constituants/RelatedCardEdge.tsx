import Xarrow from "react-xarrows";
import { RelatedCardInfo } from "./CardPanel";
import styles from "./RelatedCardEdge.module.scss";
import { useCallback, useState } from "react";
import { ArrowRightLeft } from "lucide-react";

export default function RelatedCardEdge({
  relatedCardInfo,
  relatedCardsInfo,
  setRelatedCardsInfo,
}: {
  relatedCardInfo: RelatedCardInfo;
  relatedCardsInfo: RelatedCardInfo[];
  setRelatedCardsInfo: React.Dispatch<React.SetStateAction<RelatedCardInfo[]>>;
}) {
  const [isSwitchDirectionHover, setSwitchDirectionHover] = useState(false);

  const handleEdgeLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
      const value = e.target.value;
      const newRelatedCardsInfo: RelatedCardInfo[] = relatedCardsInfo.map(
        (cardInfo) =>
          cardInfo.card._id === cardId
            ? {
                ...cardInfo,
                edge: {
                  ...cardInfo.edge,
                  label: value,
                },
              }
            : cardInfo
      );
      setRelatedCardsInfo(newRelatedCardsInfo);
    },
    [relatedCardsInfo, setRelatedCardsInfo]
  );

  const handleCheckboxChange = useCallback(
    (cardId: string) => {
      const newRelatedCardsInfo: RelatedCardInfo[] = relatedCardsInfo.map(
        (cardInfo) =>
          cardInfo.card._id === cardId
            ? {
                ...cardInfo,
                edge: {
                  ...cardInfo.edge,
                  direction:
                    cardInfo.edge.direction === "undirected"
                      ? "fromNewCard"
                      : "undirected",
                },
              }
            : cardInfo
      );
      setRelatedCardsInfo(newRelatedCardsInfo);
    },
    [relatedCardsInfo, setRelatedCardsInfo]
  );

  const handleSwitchDirection = useCallback(
    (cardId: string) => {
      const newRelatedCardsInfo: RelatedCardInfo[] = relatedCardsInfo.map(
        (cardInfo) =>
          cardInfo.card._id === cardId
            ? {
                ...cardInfo,
                edge: {
                  ...cardInfo.edge,
                  direction:
                    cardInfo.edge.direction === "toNewCard"
                      ? "fromNewCard"
                      : "toNewCard",
                },
              }
            : cardInfo
      );
      setRelatedCardsInfo(newRelatedCardsInfo);
    },
    [relatedCardsInfo, setRelatedCardsInfo]
  );

  return (
    <div className={`${styles.controlledEdgeContainer}`}>
      <div className={`${styles.edgeContainer}`}>
        <div className={`${styles.edge}`}>
          <input
            type="text"
            className={`${styles.arrowLabel}`}
            name="label"
            value={relatedCardInfo.edge.label || ""}
            onChange={(e) => handleEdgeLabelChange(e, relatedCardInfo.card._id)}
          ></input>
          <div
            id={`left-${relatedCardInfo.card._id}`}
            className={`${styles.left}`}
          ></div>
          <div
            id={`right-${relatedCardInfo.card._id}`}
            className={`${styles.right}`}
          ></div>
          <Xarrow
            start={
              relatedCardInfo.edge.direction === "fromNewCard"
                ? `left-${relatedCardInfo.card._id}`
                : `right-${relatedCardInfo.card._id}`
            }
            end={
              relatedCardInfo.edge.direction === "fromNewCard"
                ? `right-${relatedCardInfo.card._id}`
                : `left-${relatedCardInfo.card._id}`
            }
            strokeWidth={1}
            headSize={relatedCardInfo.edge.direction !== "undirected" ? 10 : 0}
            color="black"
          />
        </div>
      </div>
      <div className={`${styles.edgeDirectionControllersContainer}`}>
        <div className={`${styles.checkboxContainer}`}>
          <input
            type="checkbox"
            className={`${styles.checkboxInput}`}
            id={`checkbox-${relatedCardInfo.card._id}`}
            checked={relatedCardInfo.edge.direction !== "undirected"}
            onChange={() => handleCheckboxChange(relatedCardInfo.card._id)}
          />
          <label
            className={`${styles.controlLabel} ${styles.directedEdgeLabel}`}
            htmlFor={`checkbox-${relatedCardInfo.card._id}`}
          >
            directed edge
          </label>
        </div>
        {relatedCardInfo.edge.direction !== "undirected" && (
          <div
            className={`${styles.switchDirectionContainer}`}
            onMouseEnter={() => setSwitchDirectionHover(true)}
            onMouseLeave={() => setSwitchDirectionHover(false)}
          >
            <ArrowRightLeft
              id={`switch-${relatedCardInfo.card._id}`}
              size={12}
              cursor={"pointer"}
              color={isSwitchDirectionHover ? `#3900c9` : `#4d4d4d`}
              onClick={() => handleSwitchDirection(relatedCardInfo.card._id)}
            />

            <label
              className={`${styles.controlLabel} ${styles.switchDirectionLabel}`}
              onClick={() => handleSwitchDirection(relatedCardInfo.card._id)}
            >
              switch direction
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
