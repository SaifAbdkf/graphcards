import z from "zod";
import { Card } from "../models/CardModel";

const ApiLinkSchema = z.object({
  isDirected: z.boolean(),
  from: z.string(),
  to: z.string(),
  fromSide: z.string(),
  toSide: z.string(),
  label: z.string().optional(),
});

export const ApiConnectedCardSchema = z.object({
  deckId: z.string(),
  x: z.number(),
  y: z.number(),
  front: z.string(),
  back: z.string(),
  links: z.array(ApiLinkSchema),
});

// Schemas for GraphdeckChangePayload
const CardSchema = z.object({
  _id: z.string(),
  deckId: z.string(),
  x: z.number(),
  y: z.number(),
  front: z.string(),
  back: z.string(),
});

const LinkSchema = z.object({
  _id: z.string(),
  deckId: z.string(),
  isDirected: z.boolean(),
  from: z.string(),
  to: z.string(),
  fromSide: z.string(),
  toSide: z.string(),
  label: z.string().optional(),
});

const CardChangePayloadSchema = z.object({
  dbAction: z.union([
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  data: CardSchema,
});

const LinkChangePayloadSchema = z.object({
  dbAction: z.union([
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  data: LinkSchema,
});

export const GraphdeckChangePayloadSchema = z.object({
  deckId: z.string(),
  cards: z.array(CardChangePayloadSchema),
  links: z.array(LinkChangePayloadSchema),
});

export type ApiConnectedCard = z.infer<typeof ApiConnectedCardSchema>;
export type ApiLink = z.infer<typeof ApiLinkSchema>;

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

export async function validateLinks(
  links: ApiLink[]
): Promise<ApiResponse<ApiLink>> {
  const definedLinks = links || [];
  const linkedCardsIds = definedLinks.map((link) =>
    link.to !== "" ? link.to : link.from
  ); // direction is defined by from or to being null. linked card id is eihter in from field or in to field
  const foundLinkedCards = await Card.find({
    _id: { $in: linkedCardsIds },
  });

  if (linkedCardsIds.length !== foundLinkedCards.length) {
    return {
      status: "failure",
      message: "not all requested links found ",
    };
  }

  return {
    status: "success",
    data: definedLinks,
  };
}
