import { StateCreator } from "zustand";
import { LabView, UISlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createUISlice: StateCreator<UISlice> = (set) => ({
  labView: "graphdecks",
  setLabView: (labView: LabView) => {
    set({ labView });
  },
});

export function useLabView() {
  const { labView, setLabView } = useGraphcardsStore(
    useShallow((state) => ({
      labView: state.labView,
      setLabView: state.setLabView,
    }))
  );

  return { labView, setLabView };
}
