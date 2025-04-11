import mongoose from "mongoose";
import z from "zod";
import { Card } from "../models/CardModel";

const ApiCardLinksSchema = z.object({
  linkedCardId: z.string(),
  label: z.string(),
});

export const ApiCardSchema = z.object({
  deckId: z.string(),
  front: z.string(),
  back: z.string(),
  links: z.array(ApiCardLinksSchema).optional(),
});

export type ApiCard = z.infer<typeof ApiCardSchema>;
export type ApiLinks = z.infer<typeof ApiCardLinksSchema>;

export type ValidatedLink = {
  linkedCardId: mongoose.Types.ObjectId;
  label: string;
};

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
  // if success object  is an array of objects (Case: getCardsInfo) the default), reurn it in data
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
  links: ApiLinks[]
): Promise<ApiResponse<ValidatedLink>> {
  const definedLinks = links || [];
  const linkedCardsIds = definedLinks.map(
    (link: { linkedCardId: string; label: string }) => link.linkedCardId
  );

  const foundLinkedCards = await Card.find({ _id: { $in: linkedCardsIds } });

  if (linkedCardsIds.length !== foundLinkedCards.length) {
    return {
      status: "failure",
      message: "all requested edges found ",
    };
  }

  const validatedLinks = definedLinks.map(
    (link: { linkedCardId: string; label: string }) => ({
      linkedCardId: new mongoose.Types.ObjectId(link.linkedCardId),
      label: link.label,
    })
  );

  return {
    status: "success",
    data: validatedLinks,
  };
}
