import { v4 } from "uuid";
import { db } from "../../DB/db";
import { DeckFields } from "../../Types/appDataTypes";

export async function createDXDeckInfo(deckInfoData: DeckFields) {
  try {
    const newId = v4();
    const newDeckField = await db.DeckInfo.add({
      id: newId,
      ...deckInfoData,
    });
    console.log("newDeckField is", newDeckField);
  } catch (error) {
    console.log(error);
  }
}
