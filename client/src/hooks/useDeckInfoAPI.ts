import { getDeckInfoAPIStrategy } from "../services/dexieApi/DeckinfoDexieApi";
import { useDatabaseType } from "../store/settingsSlice";

export function useDeckInfoAPI() {
  const { databaseType } = useDatabaseType();
  return getDeckInfoAPIStrategy(databaseType);
}
