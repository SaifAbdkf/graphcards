import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck, DeckInfo } from "../../Types/types";

interface DeckStoreState {
  activeDeck: Deck | null;
  decksInfo: DeckInfo[] | null;
}

const initialState: DeckStoreState = {
  activeDeck: null,
  decksInfo: null,
};

const deckSlice = createSlice({
  name: "deckStore",
  initialState,
  reducers: {
    setActiveDeck: (state, action: PayloadAction<Deck>) => {
      state.activeDeck = action.payload;
    },
    setDecksInfo: (state, action: PayloadAction<DeckInfo[]>) => {
      state.decksInfo = action.payload;
    },
  },
});

export const { setActiveDeck, setDecksInfo } = deckSlice.actions;

export default deckSlice.reducer;
