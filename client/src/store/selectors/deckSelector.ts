import { RootState } from "../store";

export const selectSelectedDeckId = (state: RootState) =>
  state.decks.selectedDeckId;
