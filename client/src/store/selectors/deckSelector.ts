import { RootState } from "..";

export const selectDecksInfo = (state: RootState) => state.decks.decksInfo;
export const selectCurrentDeck = (state: RootState) => state.decks.currentDeck;
