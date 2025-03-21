import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck, DeckInfo } from "../../Types/types";

interface DeckStoreState {
  activeDeck: Deck | null;
  decksInfo: DeckInfo[];
}

const initialState: DeckStoreState = {
  activeDeck: null,
  decksInfo: [],
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
    addDeckInfo: (state, action: PayloadAction<DeckInfo>) => {
      const newDecksInfo = [...state.decksInfo, action.payload];
      state.decksInfo = newDecksInfo;
    },
    removeDeckInfo: (state, action: PayloadAction<string>) => {
      state.decksInfo = state.decksInfo.filter(
        (deckInfo) => deckInfo._id !== action.payload
      );
    },
  },
});

export const { setActiveDeck, setDecksInfo, addDeckInfo, removeDeckInfo } =
  deckSlice.actions;

export default deckSlice.reducer;
