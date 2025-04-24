import mongoose from "mongoose";
import z from "zod";
import { Card } from "../models/CardModel";

const EdgeDirection = z.enum(["undirected", "fromNewCard", "toNewCard"]);

const ApiEdgeSchema = z.object({
  linkedCardId: z.string(),
  direction: EdgeDirection,
  label: z.string(),
});

export const ApiCardSchema = z.object({
  deckId: z.string(),
  front: z.string(),
  back: z.string(),
  edges: z.array(ApiEdgeSchema),
});

export type ApiCard = z.infer<typeof ApiCardSchema>;
export type ApiEdge = z.infer<typeof ApiEdgeSchema>;

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;
type SuccessResponse<T> = {
  status: "success";
  data: T[];
  dataSingular?: T;
};

type FailureResponse = {
  status: "failure";
  message: string;
  error?: unknown;
};

export function successResponseObject<T>(data: T | T[]): SuccessResponse<T> {
  // if success object  is an array of objects (Case: getCardsInfo) the default), return it in data
  // if success object is a single object (case, getCard getDeck)
  return {
    status: "success",
    data: Array.isArray(data) ? data : [],
    dataSingular: Array.isArray(data) ? undefined : data,
  };
}

export function failureResponseObject(
  message: string,
  error?: unknown
): FailureResponse {
  if (error) {
    return {
      status: "failure",
      message: message,
      error: error,
    };
  } else {
    return {
      status: "failure",
      message: message,
    };
  }
}

export async function validateEdges(
  edges: ApiEdge[]
): Promise<ApiResponse<ApiEdge>> {
  const definedEdges = edges || [];
  const relatedCardsIds = definedEdges.map((edge) => edge.linkedCardId);
  const foundLinkedCards = await Card.find({
    _id: { $in: relatedCardsIds },
  });

  if (relatedCardsIds.length !== foundLinkedCards.length) {
    return {
      status: "failure",
      message: "not all requested edges found ",
    };
  }

  return {
    status: "success",
    data: definedEdges,
  };
}
