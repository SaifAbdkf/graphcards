import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../../Types/types";

interface DeckStoreState {
  selectedDeck: Deck | null;
}

const initialState: DeckStoreState = {
  selectedDeck: null,
};

const deckSlice = createSlice({
  name: "deckStore",
  initialState,
  reducers: {
    setSelectedDeck: (state, action: PayloadAction<Deck>) => {
      state.selectedDeck = action.payload;
    },
  },
});

export const { setSelectedDeck } = deckSlice.actions;

export default deckSlice.reducer;
