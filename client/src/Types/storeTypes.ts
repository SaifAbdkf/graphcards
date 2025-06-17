import { OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import {
  AppDeckInfo,
  CardFields,
  CardNode,
  DeckInfo,
  LinkEdge,
} from "./appDataTypes";
import { DbAction } from "./storageManagementTypes";

export type GraphdecksDataSlice = {
  decksInfo: DeckInfo[];
  activeDeckInfo: AppDeckInfo | null;
  setDecksInfo: (decksInfo: DeckInfo[]) => void;
  setActiveDeckInfo: (deckInfo: DeckInfo & { dbAction: DbAction }) => void;
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
  setNodeCardFields: (nodeId: string, data: CardFields) => void;
  setEdgeEditMode: (edgeId: string, editMode: boolean) => void;
  setLinkEdgeLabel: (edgeId: string, newLabel: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
};

export type LabView = "graphdecks" | "activeDeck";
export type UISlice = {
  labView: LabView;
  setLabView: (view: LabView) => void;
};
