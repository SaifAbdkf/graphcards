import { StateCreator } from "zustand";
import { DatabaseType, SettingsSlice } from "../Types/storeTypes";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  databaseType: "local",
  setDatabaseType: (databaseType: DatabaseType) => {
    set({ databaseType });
  },
});

export function useDatabaseType() {
  const { databaseType, setDatabaseType } = useGraphcardsStore(
    useShallow((state) => ({
      databaseType: state.databaseType,
      setDatabaseType: state.setDatabaseType,
    }))
  );

  return { databaseType, setDatabaseType };
}
