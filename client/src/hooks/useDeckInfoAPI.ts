import { getDeckInfoAPIStrategy } from "../services/strategies/deckInfoStrategy";
import { useDatabaseType } from "../store/settingsSlice";

export function useDeckInfoApi() {
  const { databaseType } = useDatabaseType();
  return getDeckInfoAPIStrategy(databaseType);
}
