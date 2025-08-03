import { StateCreator } from "zustand";
import { TestSlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createTestSlice: StateCreator<TestSlice> = (set, get) => ({
  deckId: null,
  previousTestLeitnerBox: null,
  date: null,
  leitnerBox: null, //1 to 6 //7 is heaven
  testedCards: [], // score is 0 for no remember, 1 for remember//extendable to anki alg
  setDeckId: (deckId: string) => {
    set({ deckId: deckId });
  },
  setPreviousTestLeitnerBox: (leitnerBox: number) => {
    set({ previousTestLeitnerBox: leitnerBox });
  },
  setDate: (date: Date) => {
    set({ date: date });
  },
  addTestedCard: (cardId: string, score: number) => {
    set({
      testedCards: [...get().testedCards, { cardId: cardId, score: score }],
    });
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
