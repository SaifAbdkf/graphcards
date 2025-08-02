import { v4 } from "uuid";
import { db } from "../../dexieDB/dexieDb";
import { DeckFields } from "../../Types/appDataTypes";
import { DeckInfoAPIStrategy } from "../strategies/deckInfoStrategy";
import { ScopedMutator } from "swr";

export const deckInfoDexieAPI: DeckInfoAPIStrategy = {
  fetchAllDecksInfo: async () => {
    try {
      const deckInfos = await db.DeckInfo.toArray();
      return deckInfos.map((deck) => ({
        _id: deck.id,
        name: deck.name,
        description: deck.description,
      }));
    } catch (error) {
      console.log("Error fetching all deck info:", error);
      throw error;
    }
  },

  createDeckInfo: async (deckFields: DeckFields, mutate: ScopedMutator) => {
    try {
      const newId = v4();
      const newDeckInfoID = await db.DeckInfo.add({
        id: newId,
        ...deckFields,
      });
      mutate("decksInfo");
      console.log("newDeckField is", newDeckInfoID);
      return { _id: newId, ...deckFields };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateDeckInfo: async (
    deckId: string,
    deckFields: DeckFields,
    mutate: ScopedMutator
  ) => {
    try {
      const updatedCount = await db.DeckInfo.update(deckId, {
        name: deckFields.name,
        description: deckFields.description,
      });
      mutate("decksInfo");

      if (updatedCount === 0) {
        throw new Error(`DeckInfo with deckId ${deckId} not found`);
      }

      console.log(`Updated ${updatedCount} deck info record(s)`);
      return {
        _id: deckId,
        ...deckFields,
      };
    } catch (error) {
      console.log("Error updating deck info:", error);
      throw error;
    }
  },
};
