import { Request, Response } from "express";
import mongoose from "mongoose";
import { Link } from "../models/LinkModel";

export async function createLink(request: Request, response: Response) {
  const { from, to, label } = request.body;

  try {
    const link = await Link.create({
      from,
      to,
      label,
    });

    return response.status(200).json(link);
  } catch (error) {
    console.log(error);
    return response.status(400).json(error);
  }
}

export async function getLinks(request: Request, response: Response) {
  const links = await Link.find();

  if (!links) {
    return response.status(404).json({ error: "there are no links" });
  }

  return response.status(200).json(links);
}

export async function updateLink(
  request: Request,
  response: Response
): Promise<Response> {
  const { linkId } = request.body;

  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      if (!mongoose.Types.ObjectId.isValid(linkId)) {
        return response.status(404).json({ error: "Link Id not valid" });
      }
    }
  }

  const link = await Link.findOneAndUpdate(
    { _id: linkId },
    { ...request.body }
  );

  if (!link) {
    if (!link) {
      return response.status(404).json({ error: "no such link" });
    }
  }

  return response.status(200).json(link);
}

export async function deleteLink(
  request: Request,
  response: Response
): Promise<Response> {
  const { linkId } = request.body;

  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    return response.status(404).json({ error: "link ID not valid" });
  }

  const link = await Link.findOneAndDelete({ _id: linkId });

  if (!link) {
    return response.status(404).json({ error: "no such link" });
  }

  return response.status(200).json(link);
}
