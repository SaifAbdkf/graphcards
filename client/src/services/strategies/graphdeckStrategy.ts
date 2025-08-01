import { GraphDeck } from "../../Types/appDataTypes";
import { GraphdeckChangePayload } from "../../Types/storageManagementTypes";
import { DatabaseType } from "../../Types/storeTypes";
import { graphdeckDexieApi } from "../dexieApi/graphdeckDexieApi";

export interface GraphdeckApiStrategy {
  updateGraphdeck: (graphdeckUpdatePayload: GraphdeckChangePayload) => void;
  fetchGraphDeck: (deckId: string) => Promise<GraphDeck>;
  deleteGraphDeck: (deckId: string) => void;
}

export function getGraphdeckApiStrategy(
  databaseType: DatabaseType
): GraphdeckApiStrategy {
  return databaseType === "local" ? graphdeckDexieApi : graphdeckDexieApi;
}
