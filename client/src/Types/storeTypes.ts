import { OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import {
  AppDeckInfo,
  CardFields,
  CardNode,
  DeckInfo,
  LinkEdge,
} from "./appDataTypes";

export type GraphdecksDataSlice = {
  decksInfo: DeckInfo[];
  activeDeckInfo: AppDeckInfo | null;
  setDecksInfo: (decksInfo: DeckInfo[]) => void;
  setActiveDeckInfo: (deckInfo: AppDeckInfo) => void;
};

export type GraphcardsDataSlice = {
  nodes: CardNode[];
  edges: LinkEdge[];
  deletedNodes: CardNode[];
  deletedEdges: LinkEdge[];
  onNodesChange: OnNodesChange<CardNode>;
  onEdgesChange: OnEdgesChange<LinkEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: CardNode[]) => void;
  setEdges: (edges: LinkEdge[]) => void;
  addNode: (node: CardNode) => void;
  setNodeEditMode: (nodeID: string, editMode: boolean) => void;
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
