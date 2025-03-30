import { Request, Response } from "express";
import { Card } from "../models/CardModel";
import mongoose, { ObjectId } from "mongoose";
import { Edge } from "../models/EdgeModel";
import { Deck } from "../models/DeckModel";

export async function createCard(request: Request, response: Response) {
  const { deckId, front, back, links } = request.body;
  //TODO find a way to create a card where its linkedCards are not already created, but needs to be created
  //introduce new linkcards arr  as a 5th element of the body
  // newLinkedCards = [{front: string, label: string}]

  try {
    // validate
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return response.status(404).json({ error: "deck not found" });
    }
    const validatedDeckId = new mongoose.Types.ObjectId(deckId);

    //validate linked
    const definedLinks = links || [];
    const linkedCardsIds = definedLinks.map(
      (link: { linkedCardId: string; label: string }) => link.linkedCardId
    );

    const foundLinkedCards = await Card.find({ _id: { $in: linkedCardsIds } });

    if (linkedCardsIds.length !== foundLinkedCards.length) {
      return response.status(404).json({
        error:
          "One or more of the supposedly existing linked cards could not be found",
      });
    }

    const validatedLinks = definedLinks.map(
      (link: { linkedCardId: string; label: string }) => ({
        link: new mongoose.Types.ObjectId(link.linkedCardId),
        label: link.label,
      })
    );

    //create card
    const newCard = new Card({
      deckId: validatedDeckId,
      front,
      back,
      links: validatedLinks,
    });

    await newCard.save();
    deck.cardIds.push(newCard._id);

    let edgeIds: ObjectId[] = [];
    // create edges
    for (const linkedCard of validatedLinks) {
      try {
        const newEdge = new Edge({
          deckId: validatedDeckId,
          from: newCard._id,
          to: linkedCard.linkedCardId,
          label: linkedCard.label,
        });
        await newEdge.save();

        //create link in the associated card
        await Card.findByIdAndUpdate(linkedCard.linkedCardId, {
          $push: {
            links: { linkedCardId: newCard._id, label: linkedCard.label },
          },
        });

        deck.edgeIds.push(newEdge._id);
      } catch (error) {
        console.log(error);
        return response
          .status(400)
          .json({ error: error, admMessage: "problem with creating an edge" });
      }
    }

    await deck.save();

    return response.status(200).json(newCard);
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, admMessage: "Server Error. Cannot create card." });
  }
}

export async function getCard(request: Request, response: Response) {
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response.status(404).json({ error: "Card Id not valid" });
  }

  const card = await Card.findById(cardId);

  if (!card) {
    return response.status(404).json({ error: "no such card" });
  }
  return response.status(200).json(card);
}

export async function getCards(request: Request, response: Response) {
  const cards = await Card.find();

  if (!cards) {
    return response.status(404).json({ error: "there are no cards" });
  }

  return response.status(200).json(cards);
}

export async function updateCard(
  request: Request,
  response: Response
): Promise<Response> {
  console.log("updating card");
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response.status(404).json({ error: "Card Id not valid" });
  }

  try {
    const card = await Card.findOneAndReplace(
      { _id: cardId },
      { ...request.body }
    );

    if (!card) {
      return response.status(404).json({ error: "no such card" });
    }
    return response.status(200).json(card);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error" });
  }
}

export async function deleteCard(
  request: Request,
  response: Response
): Promise<Response> {
  const { cardId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return response.status(404).json({ error: "Card Id not valid" });
  }

  try {
    const card = await Card.findOneAndDelete({ _id: cardId });

    if (!card) {
      return response.status(404).json({ error: "no such card" });
    } else {
      //delete cardid  from deck
      const updateDeck = Deck.findByIdAndUpdate(
        card.deckId,
        {
          $pull: { cardIds: cardId },
        },
        { new: true }
      );

      if (!updateDeck) {
        return response.status(404).json({ error: "no such deck" });
      }

      return response.status(200).json(card);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Server error" });
  }
}
