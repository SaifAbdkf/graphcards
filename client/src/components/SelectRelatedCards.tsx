import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useCallback, useRef, useState } from "react";
import { Card } from "../Types/types";
import styles from "./SelectRelatedCards.module.scss";

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
  const [searchableCards, setSearchableCards] = useState<Card[]>(cards);
  const cardSearchInput = useRef<HTMLInputElement>(null);
  const inputContainer = useRef<HTMLDivElement>(null);

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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchableCards = cards.filter((card) =>
      card.front.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(newSearchableCards);
    setSearchableCards(newSearchableCards);
  };

  console.log(inputContainer.current?.offsetWidth);
  return (
    <div className={`${styles.inputContainer}`} ref={inputContainer}>
      {/* <button onClick={handleMenuEnter}>test</button> */}
      <input
        ref={cardSearchInput}
        type="text"
        onClick={handleSearchClick}
        onBlur={handleInputBlur} // Track blur
        onChange={handleSearchInputChange}
        className={`${styles.searchInput}`}
        autoComplete="off"
      ></input>
      <ControlledMenu
        captureFocus={false}
        anchorRef={cardSearchInput}
        state={isOpen ? "open" : "closed"}
        onClose={handleControlledMenuOnClose}
        autoFocus={false}
        className={`${styles.menu}`}
      >
        {searchableCards?.map((card) => (
          <MenuItem
            key={card._id}
            onFocus={handleItemHover}
            onClick={handleItemClick}
          >
            <div
              className={`${styles.item}`}
              style={{
                width: inputContainer.current?.offsetWidth
                  ? inputContainer.current?.offsetWidth - 2
                  : 200,
              }}
            >
              {card.front}
            </div>
          </MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
}
