import Xarrow from "react-xarrows";
import { RelatedCardFields } from "./CardPanel";
import styles from "./RelatedCardEdge.module.scss";
import { useCallback, useState } from "react";
import { ArrowRightLeft } from "lucide-react";

export default function RelatedCardEdge({
  relatedCardFields,
  handleRelatedCardFieldsChange,
}: {
  relatedCardFields: RelatedCardFields;
  handleRelatedCardFieldsChange: (newRelatedCard: RelatedCardFields) => void;
}) {
  const [isSwitchDirectionHover, setSwitchDirectionHover] = useState(false);

  const handleEdgeLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      console.log(value);
      const newRelatedCardFields = {
        ...relatedCardFields,
        edge: { ...relatedCardFields.edge, label: value },
      };
      handleRelatedCardFieldsChange(newRelatedCardFields);
    },
    [relatedCardFields, handleRelatedCardFieldsChange]
  );

  const handleDirectionCheckboxChange = useCallback(() => {
    const newRelatedCardFields = {
      ...relatedCardFields,
      edge: {
        ...relatedCardFields.edge,
        isDirected: !relatedCardFields.edge.isDirected,
        to: relatedCardFields.card._id,
        from: "",
      },
    };
    handleRelatedCardFieldsChange(newRelatedCardFields);
  }, [handleRelatedCardFieldsChange, relatedCardFields]);

  const handleSwitchDirection = useCallback(() => {
    const newRelatedCardFields = {
      ...relatedCardFields,
      edge: {
        ...relatedCardFields.edge,
        from: relatedCardFields.edge.to,
        to: relatedCardFields.edge.from,
      },
    };
    handleRelatedCardFieldsChange(newRelatedCardFields);
  }, [handleRelatedCardFieldsChange, relatedCardFields]);

  return (
    <div className={`${styles.controlledEdgeContainer}`}>
      <div className={`${styles.edgeContainer}`}>
        <div className={`${styles.edge}`}>
          <input
            type="text"
            className={`${styles.arrowLabel}`}
            name="label"
            value={relatedCardFields.edge.label || ""}
            onChange={(e) => handleEdgeLabelChange(e)}
            autoComplete="off"
          ></input>
          <div
            id={`left-${relatedCardFields.card._id}`}
            className={`${styles.left}`}
          ></div>
          <div
            id={`right-${relatedCardFields.card._id}`}
            className={`${styles.right}`}
          ></div>
          <Xarrow
            start={
              relatedCardFields.edge.isDirected &&
              relatedCardFields.edge.from === ""
                ? `left-${relatedCardFields.card._id}`
                : `right-${relatedCardFields.card._id}`
            }
            end={
              relatedCardFields.edge.isDirected &&
              relatedCardFields.edge.from === ""
                ? `right-${relatedCardFields.card._id}`
                : `left-${relatedCardFields.card._id}`
            }
            strokeWidth={1}
            headSize={relatedCardFields.edge.isDirected ? 10 : 0}
            color="black"
          />
        </div>
      </div>
      <div className={`${styles.edgeDirectionControllersContainer}`}>
        <div className={`${styles.checkboxContainer}`}>
          <input
            type="checkbox"
            className={`${styles.checkboxInput}`}
            id={`checkbox-${relatedCardFields.card._id}`}
            checked={relatedCardFields.edge.isDirected}
            onChange={() => handleDirectionCheckboxChange()}
          />
          <label
            className={`${styles.controlLabel} ${styles.directedEdgeLabel}`}
            htmlFor={`checkbox-${relatedCardFields.card._id}`}
          >
            directed link
          </label>
        </div>
        {relatedCardFields.edge.isDirected && (
          <div
            className={`${styles.switchDirectionContainer}`}
            onMouseEnter={() => setSwitchDirectionHover(true)}
            onMouseLeave={() => setSwitchDirectionHover(false)}
          >
            <ArrowRightLeft
              id={`switch-${relatedCardFields.card._id}`}
              size={12}
              cursor={"pointer"}
              color={isSwitchDirectionHover ? `#3900c9` : `#4d4d4d`}
              onClick={() => handleSwitchDirection()}
            />

            <label
              className={`${styles.controlLabel} ${styles.switchDirectionLabel}`}
              onClick={() => handleSwitchDirection()}
            >
              switch direction
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
