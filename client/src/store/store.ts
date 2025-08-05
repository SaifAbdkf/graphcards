import { create } from "zustand";
import {
  GraphcardsDataSlice,
  GraphdecksDataSlice,
  UISlice,
  SettingsSlice,
  TestSlice,
} from "../Types/storeTypes";
import { createUISlice } from "./UISlice";
import { createGraphdecksDataSlice } from "./graphdecksDataSlice";
import { createGraphcardsDataSlice } from "./graphcardsDataSlice";
import { createSettingsSlice } from "./settingsSlice";
import { devtools } from "zustand/middleware";
import { createTestSlice } from "./testSlice";

export type GraphcardsStoreState = UISlice &
  GraphdecksDataSlice &
  GraphcardsDataSlice &
  TestSlice &
  SettingsSlice;

export const useGraphcardsStore = create<GraphcardsStoreState>()(
  devtools((...a) => ({
    ...createUISlice(...a),
    ...createGraphdecksDataSlice(...a),
    ...createGraphcardsDataSlice(...a),
    ...createSettingsSlice(...a),
    ...createTestSlice(...a),
  }))
);
