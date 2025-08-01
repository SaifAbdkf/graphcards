import { getGraphdeckApiStrategy } from "../services/strategies/graphdeckStrategy";
import { useDatabaseType } from "../store/settingsSlice";

export function useGraphdeckApi() {
  const { databaseType } = useDatabaseType();
  return getGraphdeckApiStrategy(databaseType);
}
