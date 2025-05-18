import Xarrow from "react-xarrows";
import styles from "./LinkedCardForm.module.scss";
import { useCallback, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { LinkedCardFields } from "./CardPanel";

export default function LinkedCardForm({
  linkedCardFields,
  handleLinkedCardFieldsChange,
}: {
  linkedCardFields: LinkedCardFields;
  handleLinkedCardFieldsChange: (newLinkedCard: LinkedCardFields) => void;
}) {
  const [isSwitchDirectionHover, setSwitchDirectionHover] = useState(false);

  const handleLinkLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      console.log(value);
      const newLinkedCardFields = {
        ...linkedCardFields,
        link: { ...linkedCardFields.link, label: value },
      };
      handleLinkedCardFieldsChange(newLinkedCardFields);
    },
    [linkedCardFields, handleLinkedCardFieldsChange]
  );

  const handleDirectionCheckboxChange = useCallback(() => {
    const newLinkedCardFields = {
      ...linkedCardFields,
      link: {
        ...linkedCardFields.link,
        isDirected: !linkedCardFields.link.isDirected,
        to: linkedCardFields.card._id,
        from: "",
      },
    };
    handleLinkedCardFieldsChange(newLinkedCardFields);
  }, [handleLinkedCardFieldsChange, linkedCardFields]);

  const handleSwitchDirection = useCallback(() => {
    const newLinkedCardFields = {
      ...linkedCardFields,
      link: {
        ...linkedCardFields.link,
        from: linkedCardFields.link.to,
        to: linkedCardFields.link.from,
      },
    };
    handleLinkedCardFieldsChange(newLinkedCardFields);
  }, [handleLinkedCardFieldsChange, linkedCardFields]);

  return (
    <div className={`${styles.controlledLinkContainer}`}>
      <div className={`${styles.linkContainer}`}>
        <div className={`${styles.link}`}>
          <input
            type="text"
            className={`${styles.arrowLabel}`}
            name="label"
            value={linkedCardFields.link.label || ""}
            onChange={(e) => handleLinkLabelChange(e)}
            autoComplete="off"
          ></input>
          <div
            id={`left-${linkedCardFields.card._id}`}
            className={`${styles.left}`}
          ></div>
          <div
            id={`right-${linkedCardFields.card._id}`}
            className={`${styles.right}`}
          ></div>
          <Xarrow
            start={
              linkedCardFields.link.isDirected &&
              linkedCardFields.link.from === ""
                ? `left-${linkedCardFields.card._id}`
                : `right-${linkedCardFields.card._id}`
            }
            end={
              linkedCardFields.link.isDirected &&
              linkedCardFields.link.from === ""
                ? `right-${linkedCardFields.card._id}`
                : `left-${linkedCardFields.card._id}`
            }
            strokeWidth={1}
            headSize={linkedCardFields.link.isDirected ? 10 : 0}
            color="black"
          />
        </div>
      </div>
      <div className={`${styles.linkDirectionControllersContainer}`}>
        <div className={`${styles.checkboxContainer}`}>
          <input
            type="checkbox"
            className={`${styles.checkboxInput}`}
            id={`checkbox-${linkedCardFields.card._id}`}
            checked={linkedCardFields.link.isDirected}
            onChange={() => handleDirectionCheckboxChange()}
          />
          <label
            className={`${styles.controlLabel} ${styles.directedLinkLabel}`}
            htmlFor={`checkbox-${linkedCardFields.card._id}`}
          >
            directed link
          </label>
        </div>
        {linkedCardFields.link.isDirected && (
          <div
            className={`${styles.switchDirectionContainer}`}
            onMouseEnter={() => setSwitchDirectionHover(true)}
            onMouseLeave={() => setSwitchDirectionHover(false)}
          >
            <ArrowRightLeft
              id={`switch-${linkedCardFields.card._id}`}
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
