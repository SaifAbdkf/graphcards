import { StateCreator } from "zustand";
import { AppDeckInfo, DeckFields } from "../Types/appDataTypes";
import { GraphdecksDataSlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";
import { DbAction } from "../Types/storageManagementTypes";

export const createGraphdecksDataSlice: StateCreator<GraphdecksDataSlice> = (
  set,
  get
) => ({
  decksInfo: [],
  setDecksInfo: (decksInfo: AppDeckInfo[]) => {
    set({ decksInfo });
  },
  deletedDecksInfo: [],
  deleteDeckInfo: (deckInfoId: string) => {
    const deckToDelete = get().decksInfo.find(
      (deckInfo) => deckInfo._id === deckInfoId
    );
    if (deckToDelete) {
      const newDecksInfo = get().decksInfo.filter(
        (deckInfo) => deckInfo._id !== deckInfoId
      );
      set({ decksInfo: newDecksInfo });
      set({ deletedDecksInfo: [...get().deletedDecksInfo, deckToDelete] });
    }
  },
  editDeckInfo: (deckInfoId: string, deckFields: DeckFields) => {
    const newDecksInfo = get().decksInfo.map((deckInfo) =>
      deckInfo._id === deckInfoId
        ? {
            ...deckInfo,
            name: deckFields.name,
            description: deckFields.description,
            dbAction:
              deckInfo.dbAction === "create"
                ? ("create" as DbAction)
                : ("update" as DbAction),
          }
        : deckInfo
    );
    set({ decksInfo: newDecksInfo });
  },
  addDeckInfo: (deckFields: DeckFields) => {
    const newDeckInfo: AppDeckInfo = {
      _id: `temp-${Date.now()}`,
      dbAction: "create" as DbAction,
      ...deckFields,
    };
    set({ decksInfo: [...get().decksInfo, newDeckInfo] });
  },
  activeDeckInfo: null,
  setActiveDeckInfo: (activeDeckInfo: AppDeckInfo) => {
    set({ activeDeckInfo });
  },
});

export const useStoreDecksInfo = () => {
  const decksInfo = useGraphcardsStore(useShallow((state) => state.decksInfo));
  return decksInfo;
};
