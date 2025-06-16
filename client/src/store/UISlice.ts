import { StateCreator } from "zustand";
import { LabView, UISlice } from "../Types/storeTypes";

export const createUISlice: StateCreator<UISlice> = (set) => ({
  labView: "graphdecks",
  setLabView: (labView: LabView) => {
    set({ labView });
  },
});
