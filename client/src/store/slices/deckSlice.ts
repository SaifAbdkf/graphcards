import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck, DeckInfo } from "../../Types/types";

interface DeckStoreState {
  deckStoreRefresh: boolean;
  currentDeck: Deck | null;
  decksInfo: DeckInfo[];
}

const initialState: DeckStoreState = {
  deckStoreRefresh: true,
  decksInfo: [],
  currentDeck: null,
};

const deckSlice = createSlice({
  name: "deckStore",
  initialState,
  reducers: {
    setCurrentDeck: (state, action: PayloadAction<Deck>) => {
      state.currentDeck = action.payload;
    },
    setDecksInfo: (state, action: PayloadAction<DeckInfo[]>) => {
      state.decksInfo = action.payload;
    },
  },
});

export const { setCurrentDeck, setDecksInfo } = deckSlice.actions;

export default deckSlice.reducer;
