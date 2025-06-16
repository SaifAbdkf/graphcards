import { create } from "zustand";
import {
  GraphcardsDataSlice,
  GraphdecksDataSlice,
  UISlice,
} from "../Types/storeTypes";
import { createUISlice } from "./UISlice";
import { createGraphdecksDataSlice } from "./graphdecksDataSlice";
import { createGraphcardsDataSlice } from "./graphcardsDataSlice";
import { devtools } from "zustand/middleware";

export type GraphcardsStoreState = UISlice &
  GraphdecksDataSlice &
  GraphcardsDataSlice;

export const useGraphcardsStore = create<GraphcardsStoreState>()(
  devtools((...a) => ({
    ...createUISlice(...a),
    ...createGraphdecksDataSlice(...a),
    ...createGraphcardsDataSlice(...a),
  }))
);
