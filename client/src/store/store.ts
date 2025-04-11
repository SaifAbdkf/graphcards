import { configureStore } from "@reduxjs/toolkit";
import deckReducer from "./slices/deckSlice";
export const store = configureStore({
  reducer: {
    decks: deckReducer,
    // cards: cardReducer,
  },
});

// Define RootState & AppDispatch for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
