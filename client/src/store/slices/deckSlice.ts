import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck, DeckInfo } from "../../Types/types";

interface DeckStoreState {
  currentDeck: Deck | null;
  decksInfo: DeckInfo[] | null;
}

const initialState: DeckStoreState = {
  currentDeck: null,
  decksInfo: null,
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
