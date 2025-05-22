import { create } from "zustand";
import { cardHandleToSide, GraphcardsState, LinkEdge } from "../Types/types";
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
    console.log(connection);
    const newEdge: LinkEdge = {
      ...connection,
      id: `tempId-${connection.source}-${
        connection.target
      }-${Date.now().toString()}`,
      type: "LinkEdge",
      data: {
        deckId: "dummy",
        _id: "dummy",
        toUpdate: true,
        isDirected: true,
        from: connection.source,
        to: connection.target,
        toSide: cardHandleToSide(connection.targetHandle),
        fromSide: cardHandleToSide(connection.sourceHandle),
      },
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
