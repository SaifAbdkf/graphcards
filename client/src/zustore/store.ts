import { create } from "zustand";
import {
  CardNode,
  DbAction,
  DeckInfo,
  GraphcardsState,
  LinkEdge,
} from "../Types/types";
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
    console.log("chages are", changes);
    set({ nodes: applyNodeChanges(changes, get().nodes) });

    // Get all position changes
    const positionChanges = changes.filter(
      (change) => change.type === "position"
    );

    if (positionChanges.length > 0) {
      set({
        nodes: get().nodes.map((node) =>
          positionChanges.some((change) => change.id === node.id)
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
        editMode: true,
        isDirected: true,
        from: connection.source,
        to: connection.target,
        fromSide: connection.sourceHandle || "",
        toSide: connection.targetHandle || "",
      },
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },
  setActiveDeckInfo: (activeDeckInfo: DeckInfo & { dbAction: DbAction }) => {
    set({ activeDeckInfo });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  addNode: (node: CardNode) => {
    set({ nodes: [...get().nodes, node] });
  },
  setNodeEditMode: (node: CardNode, editMode: boolean) => {
    const newNodes = get().nodes.map((storeNode) =>
      storeNode.id === node.id
        ? { ...node, data: { ...storeNode.data, editMode: editMode } }
        : storeNode
    );
    set({ nodes: newNodes });
  },
}));
