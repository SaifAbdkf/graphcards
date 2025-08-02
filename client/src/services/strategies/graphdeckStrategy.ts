import { ScopedMutator } from "swr";
import { GraphDeck } from "../../Types/appDataTypes";
import { GraphdeckChangePayload } from "../../Types/storageManagementTypes";
import { DatabaseType } from "../../Types/storeTypes";
import { graphdeckDexieApi } from "../dexieApi/graphdeckDexieApi";
import { graphdeckNodeApi } from "../nodeApi/graphdeckNodeApi";

export interface GraphdeckApiStrategy {
  updateGraphdeck: (
    graphdeckUpdatePayload: GraphdeckChangePayload,
    mutate: ScopedMutator
  ) => void;
  fetchGraphdeck: (deckId: string) => Promise<GraphDeck>;
  deleteGraphdeck: (deckId: string, mutate: ScopedMutator) => void;
}

export function getGraphdeckApiStrategy(
  databaseType: DatabaseType
): GraphdeckApiStrategy {
  return databaseType === "local" ? graphdeckDexieApi : graphdeckNodeApi;
}
