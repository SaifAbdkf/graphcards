import { v4 } from "uuid";
import { GraphdeckApiStrategy } from "../strategies/graphdeckStrategy";
import { db } from "../../dexieDB/dexieDb";
import { ScopedMutator } from "swr";
import { ObjectId } from "bson";

export const graphdeckDexieApi: GraphdeckApiStrategy = {
  fetchGraphdeck: async (deckId: string) => {
    try {
      const deckInfo = await db.DeckInfo.get(deckId);

      if (!deckInfo) {
        throw new Error(`deckInfo with id ${deckId} not found`);
      }

      // Fetch cards for this deck
      const cards = await db.Card.where("deckId").equals(deckId).toArray();

      // Fetch links for this deck
      const links = await db.Link.where("deckId").equals(deckId).toArray();

      // Return complete GraphDeck object
      return {
        _id: deckInfo.id,
        name: deckInfo.name,
        description: deckInfo.description,
        cards: cards.map((card) => ({
          _id: card.id,
          deckId: card.deckId,
          x: card.x,
          y: card.y,
          front: card.front,
          back: card.back,
        })),
        links: links.map((link) => ({
          _id: link.id,
          deckId: link.deckId,
          isDirected: link.isDirected,
          from: link.from,
          to: link.to,
          fromSide: link.fromSide,
          toSide: link.toSide,
          label: link.label,
        })),
      };
    } catch (error) {
      console.error("Error fetching GraphDeck:", error);
      throw error;
    }
  },

  updateGraphdeck: async (graphdeckUpdatePayload, mutate: ScopedMutator) => {
    //cards
    const cardPayloads = graphdeckUpdatePayload.cards;
    cardPayloads.forEach(async (cardPayload) => {
      switch (cardPayload.dbAction) {
        case "create":
          try {
            const newCardId = await db.Card.add({
              id: cardPayload.data._id,
              ...cardPayload.data,
            });
            console.log("newCard Id is", newCardId);
          } catch (error) {
            console.log(error);
            throw error;
          }
          break;
        case "update":
          try {
            const { _id, ...cardFields } = cardPayload.data;
            const updatedCount = await db.Card.update(_id, {
              ...cardFields,
            });
            if (updatedCount === 0) {
              throw new Error(`card with id ${_id} not found`);
            }

            console.log(`Updated ${updatedCount} Card info record(s)`);
          } catch (error) {
            console.log("Error updating card:", error);
            throw error;
          }
          break;
        case "delete":
          try {
            const { _id } = cardPayload.data;
            await db.Card.delete(_id);
            console.log(`Deleted card with id ${_id}`);
          } catch (error) {
            console.log("Error deleting card:", error);
            throw error;
          }
      }
    });

    //links
    const linkPayloads = graphdeckUpdatePayload.links;
    linkPayloads.forEach(async (linkPayload) => {
      switch (linkPayload.dbAction) {
        case "create":
          try {
            const newLinkId = await db.Link.add({
              id: linkPayload.data._id,
              ...linkPayload.data,
            });
            console.log("newLink Id is", newLinkId);
            return newLinkId;
          } catch (error) {
            console.log(error);
            throw error;
          }
        case "update":
          try {
            const { _id, ...linkFields } = linkPayload.data;
            const updatedCount = await db.Link.update(_id, {
              ...linkFields,
            });
            if (updatedCount === 0) {
              throw new Error(`link with id ${_id} not found`);
            }

            console.log(`Updated ${updatedCount} Link info record(s)`);
            return {
              _id,
              ...linkFields,
            };
          } catch (error) {
            console.log("Error updating link:", error);
            throw error;
          }
        case "delete":
          try {
            const { _id } = linkPayload.data;
            await db.Link.delete(_id);
            console.log(`Deleted link with id ${_id}`);
            return linkPayload.data;
          } catch (error) {
            console.log("Error deleting link:", error);
            throw error;
          }
      }
    });

    mutate(graphdeckUpdatePayload.deckId);
  },

  deleteGraphdeck: async (deckId: string, mutate: ScopedMutator) => {
    try {
      await db.DeckInfo.delete(deckId);
      console.log(`Deleted deck with id ${deckId}`);
      mutate("decksInfo");
    } catch (error) {
      console.log("Error deleting deck:", error);
      throw error;
    }
  },
};
