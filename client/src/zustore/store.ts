import { create } from "zustand";
import { GraphcardsState, LinkEdge } from "../Types/types";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
} from "@xyflow/react";

export const useGraphcardStore = create<GraphcardsState>((set, get) => ({
  activeDeckInfo: null,
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    const newEdge: LinkEdge = {
      ...connection,
      type: "LinkEdge",
      toUpdate: true,
      id: `${connection.source}-${connection.target}-${Date.now().toString()}`,
      isDirected: true,
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
}));
