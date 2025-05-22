import { create } from "zustand";
import { DbAction, GraphcardsState, LinkEdge } from "../Types/types";
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
    if (changes[0].type === "position") {
      const changedNodeId = changes[0].id;
      set({
        nodes: get().nodes.map((node) =>
          node.id === changedNodeId
            ? {
                ...node,
                data: { ...node.data, dbAction: "update" as DbAction },
              }
            : node
        ),
      });
    }
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
        dbAction: "create",
        isDirected: true,
        from: connection.source,
        to: connection.target,
        fromSide: connection.sourceHandle || "",
        toSide: connection.targetHandle || "",
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
