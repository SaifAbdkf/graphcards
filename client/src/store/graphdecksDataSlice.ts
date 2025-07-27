import { StateCreator } from "zustand";
import { GraphdecksDataSlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";
import { DeckInfo } from "../Types/appDataTypes";

export const createGraphdecksDataSlice: StateCreator<GraphdecksDataSlice> = (
  set
) => ({
  decksInfo: [],
  setDecksInfo: (decksInfo: DeckInfo[]) => {
    set({ decksInfo });
  },
  activeDeckInfo: null,
  setActiveDeckInfo: (activeDeckInfo: DeckInfo) => {
    set({ activeDeckInfo });
  },
});

export const useStoreDecksInfo = () => {
  const decksInfo = useGraphcardsStore(useShallow((state) => state.decksInfo));
  return decksInfo;
};
