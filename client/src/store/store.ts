import { create } from "zustand";
import {
  GraphcardsDataSlice,
  GraphdecksDataSlice,
  UISlice,
  SettingsSlice,
} from "../Types/storeTypes";
import { createUISlice } from "./UISlice";
import { createGraphdecksDataSlice } from "./graphdecksDataSlice";
import { createGraphcardsDataSlice } from "./graphcardsDataSlice";
import { createSettingsSlice } from "./settingsSlice";
import { devtools } from "zustand/middleware";

export type GraphcardsStoreState = UISlice &
  GraphdecksDataSlice &
  GraphcardsDataSlice &
  SettingsSlice;

export const useGraphcardsStore = create<GraphcardsStoreState>()(
  devtools((...a) => ({
    ...createUISlice(...a),
    ...createGraphdecksDataSlice(...a),
    ...createGraphcardsDataSlice(...a),
    ...createSettingsSlice(...a),
  }))
);
