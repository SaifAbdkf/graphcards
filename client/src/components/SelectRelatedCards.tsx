import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useCallback, useRef, useState } from "react";
import { Card } from "../Types/types";

export default function SelectRelatedCards({
  cards,
  selectedCardIds,
  setSelectedCardIds,
}: {
  cards: Card[];
  selectedCardIds: string[];
  setSelectedCardIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isOpen, setOpen] = useState(false);
  const cardSearchInput = useRef<HTMLInputElement>(null);

  const handleSearchClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleControlledMenuOnClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleItemHover = useCallback(() => {
    if (cardSearchInput.current) {
      cardSearchInput.current.focus();
      setOpen(true);
    }
  }, []);

  const handleItemClick = useCallback(() => {
    setOpen(false);
    cardSearchInput.current?.blur();
  }, []);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget) {
      const isMenuItem = (e.relatedTarget as HTMLElement).tagName === "LI";
      if (isMenuItem) {
        return;
      }
    }
    setOpen(false);
  };

  return (
    <div>
      {/* <button onClick={handleMenuEnter}>test</button> */}
      <input
        ref={cardSearchInput}
        type="text"
        onClick={handleSearchClick}
        onBlur={handleInputBlur} // Track blur
      ></input>
      <ControlledMenu
        captureFocus={false}
        anchorRef={cardSearchInput}
        state={isOpen ? "open" : "closed"}
        onClose={handleControlledMenuOnClose}
        autoFocus={false}
      >
        {cards.map((card) => (
          <MenuItem onFocus={handleItemHover} onClick={handleItemClick}>
            {card.front}
          </MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
}
