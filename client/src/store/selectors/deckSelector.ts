import { RootState } from "..";

export const selectDecksInfo = (state: RootState) => state.decks.decksInfo;
export const selectActiveDeck = (state: RootState) => state.decks.activeDeck;
