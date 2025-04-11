import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeckStoreState {
  selectedDeckId: string | null;
}

const initialState: DeckStoreState = {
  selectedDeckId: null,
};

const deckSlice = createSlice({
  name: "deckStore",
  initialState,
  reducers: {
    setSelectedDeckId: (state, action: PayloadAction<string>) => {
      state.selectedDeckId = action.payload;
    },
  },
});

export const { setSelectedDeckId } = deckSlice.actions;

export default deckSlice.reducer;
