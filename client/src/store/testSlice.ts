import { StateCreator } from "zustand";
import { TestSlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createTestSlice: StateCreator<TestSlice> = (set, get) => ({
  testingDeckId: null,
  previousTestLeitnerBox: null,
  date: null,
  leitnerBox: null, //1 to 6 //7 is heaven
  testedCards: [], // score is 0 for no remember, 1 for remember//extendable to anki alg
  setTestingDeckId: (deckId: string) => {
    console.log("asbaaa");

    set({ testingDeckId: deckId });
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

export const useTestDeck = () => {
  const { testingDeckId, setTestingDeckId, decksInfo } = useGraphcardsStore(
    useShallow((state) => ({
      testingDeckId: state.testingDeckId,
      setTestingDeckId: state.setTestingDeckId,
      decksInfo: state.decksInfo,
    }))
  );

  const testingDeckName = decksInfo
    .filter((deckinfo) => deckinfo._id)
    ?.at(0)?.name;

  return { testingDeckId, setTestingDeckId, testingDeckName };
};
