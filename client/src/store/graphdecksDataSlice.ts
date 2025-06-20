import { StateCreator } from "zustand";
import { DeckInfo } from "../Types/appDataTypes";
import { DbAction } from "../Types/storageManagementTypes";
import { GraphdecksDataSlice } from "../Types/storeTypes";

export const createGraphdecksDataSlice: StateCreator<GraphdecksDataSlice> = (
  set
) => ({
  activeDeckInfo: null,
  setActiveDeckInfo: (activeDeckInfo: DeckInfo & { dbAction: DbAction }) => {
    set({ activeDeckInfo });
  },
});
