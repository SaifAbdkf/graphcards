import z from "zod";
import { Card } from "../models/CardModel";

const ApiEdgeSchema = z.object({
  isDirected: z.boolean(),
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

export const ApiConnectedCardSchema = z.object({
  deckId: z.string(),
  front: z.string(),
  back: z.string(),
  edges: z.array(ApiEdgeSchema),
});

export type ApiConnectedCard = z.infer<typeof ApiConnectedCardSchema>;
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
  const relatedCardsIds = definedEdges.map((edge) =>
    edge.to !== "" ? edge.to : edge.from
  ); // direction is defined by from or to being null. related card id is eihter in from field or in o field
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
