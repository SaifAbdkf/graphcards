import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck, DeckFormFields, DeckInfo } from "../../Types/types";
import { deepCopy } from "../../utils/utils";
import { Satellite } from "lucide-react";

interface DeckStoreState {
  activeDeck: Deck | null;
  decksInfo: DeckInfo[];
  rollbackDeckInfo: DeckInfo | null; //optimistic UI on edi deck => i have to store edited deck just i case db update fails and i have to roll back
}

const initialState: DeckStoreState = {
  activeDeck: null,
  decksInfo: [],
  rollbackDeckInfo: null,
};

type UpdateDeck = {
  deckId: string;
  newDeckFormFields: DeckFormFields;
  oldDeckFormFields: DeckFormFields;
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
    updateDeckInfo: (state, action: PayloadAction<UpdateDeck>) => {
      state.rollbackDeckInfo = deepCopy({
        _id: action.payload.deckId,
        ...action.payload.oldDeckFormFields,
      });
      state.decksInfo = state.decksInfo.map((deckInfo) =>
        deckInfo._id === action.payload.deckId
          ? {
              _id: action.payload.deckId,
              ...action.payload.newDeckFormFields,
            }
          : deckInfo
      );
    },
    deleteDeckInfo: (state, action: PayloadAction<DeckInfo>) => {
      if (state.rollbackDeckInfo !== null)
        throw new Error(
          "trying to delete deck, state.rollbackDeckInfo should be null"
        );
      state.rollbackDeckInfo = deepCopy(action.payload);
      state.decksInfo = state.decksInfo.filter(
        (deckInfo) => deckInfo._id !== action.payload._id
      );
    },
    rollbackDeckInfo: (state) => {
      //TODO: assert not null ,Question: why do i sillhave to use "?" line 63
      if (state.rollbackDeckInfo !== null)
        throw new Error("state.rollbackDeckInfo should be defined");

      state.decksInfo = state.decksInfo.map((deckInfo) => {
        if (
          state.rollbackDeckInfo !== null &&
          deckInfo._id !== state.rollbackDeckInfo?._id
        ) {
          return {
            ...state.rollbackDeckInfo,
          };
        } else {
          return deckInfo;
        }
      });

      state.rollbackDeckInfo = null;
    },
  },
});

export const {
  setActiveDeck,
  setDecksInfo,
  addDeckInfo,
  updateDeckInfo,
  deleteDeckInfo,
  removeDeckInfo,
  rollbackDeckInfo,
} = deckSlice.actions;

export default deckSlice.reducer;
