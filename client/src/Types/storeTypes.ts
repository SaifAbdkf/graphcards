import { OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import { CardFields, CardNode, DeckInfo, LinkEdge } from "./appDataTypes";

export type GraphdecksDataSlice = {
  decksInfo: DeckInfo[];
  setDecksInfo: (decksInfo: DeckInfo[]) => void;
  activeDeckInfo: DeckInfo | null;
  setActiveDeckInfo: (deckInfo: DeckInfo) => void;
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

export type TestSlice = {
  testingDeckId: string | null;
  previousTestLeitnerBox: number | null;
  date: Date | null;
  leitnerBox: number | null; //1 to 6 //7 is heaven
  testedCards: { cardId: string; score: number }[]; // score is 0 for no remember, 1 for remember//extendable to anki alg
  setTestingDeckId: (deckId: string) => void;
  setPreviousTestLeitnerBox: (leitnerBox: number) => void;
  setDate: (date: Date) => void;
  addTestedCard: (cardId: string, score: number) => void;
};

export type LabView = "graphdecks" | "activeDeck" | "testingGraphdeck";
export type UISlice = {
  labView: LabView;
  setLabView: (view: LabView) => void;
};

export type DatabaseType = "local" | "cloud";
export type SettingsSlice = {
  databaseType: DatabaseType;
  setDatabaseType: (databaseType: DatabaseType) => void;
};
