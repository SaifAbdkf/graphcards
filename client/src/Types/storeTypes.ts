import { OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import {
  AppDeckInfo,
  CardFields,
  CardNode,
  DeckFields,
  LinkEdge,
} from "./appDataTypes";

export type GraphdecksDataSlice = {
  decksInfo: AppDeckInfo[];
  setDecksInfo: (decksInfo: AppDeckInfo[]) => void;
  deletedDecksInfo: AppDeckInfo[];
  deleteDeckInfo: (deckInfoId: string) => void;
  editDeckInfo: (deckInfoID: string, deckFields: DeckFields) => void;
  addDeckInfo: (deckFields: DeckFields) => void;
  activeDeckInfo: AppDeckInfo | null;
  setActiveDeckInfo: (deckInfo: AppDeckInfo) => void;
};

export type GraphcardsDataSlice = {
  nodes: CardNode[];
  EditingNodeId: string | null;
  edges: LinkEdge[];
  deletedNodes: CardNode[];
  deletedEdges: LinkEdge[];
  onNodesChange: OnNodesChange<CardNode>;
  onEdgesChange: OnEdgesChange<LinkEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: CardNode[]) => void;
  setEdges: (edges: LinkEdge[]) => void;
  addNode: (node: CardNode) => void;
  setNodeEditMode: (nodeId: string, editMode: boolean) => void;
  editNodeCardFields: (nodeId: string, data: CardFields) => void;
  setEdgeEditMode: (edgeId: string, editMode: boolean) => void;
  editLinkEdgeLabel: (edgeId: string, newLabel: string) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
};

export type LabView = "graphdecks" | "activeDeck";
export type UISlice = {
  labView: LabView;
  setLabView: (view: LabView) => void;
};
