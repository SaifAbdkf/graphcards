import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  CardFields,
  CardNode,
  DbAction,
  DeckInfo,
  GraphcardsState,
  LinkEdge,
  LinkFields,
} from "../Types/types";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
} from "@xyflow/react";

export const useGraphcardStore = create<GraphcardsState>()(
  devtools((set, get) => ({
    activeDeckInfo: null,
    nodes: [],
    edges: [],
    deletedNodes: [],
    deletedEdges: [],
    onNodesChange: (changes) => {
      set({ nodes: applyNodeChanges(changes, get().nodes) });

      // update the node.data.xy state
      const positionChanges = changes.filter(
        (change) => change.type === "position"
      );
      const nodes = get().nodes;
      if (positionChanges.length > 0) {
        positionChanges.forEach((change) => {
          const nodeChanged = nodes.find((node) => node.id === change.id);
          if (nodeChanged && change.position !== undefined) {
            const position = change.position; // Store it in a variable after the check
            set({
              nodes: nodes.map((node) =>
                node.id === nodeChanged.id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        dbAction:
                          node.data.dbAction === "create"
                            ? ("create" as DbAction)
                            : ("update" as DbAction),
                        x: position.x, // Now TypeScript knows this is defined
                        y: position.y,
                      },
                    }
                  : node
              ),
            });
          }
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
    setNodeEditMode: (nodeId: string, editMode: boolean) => {
      const newNodes = get().nodes.map((storeNode) =>
        storeNode.id === nodeId
          ? { ...storeNode, data: { ...storeNode.data, editMode: editMode } }
          : storeNode
      );
      set({ nodes: newNodes });
    },
    setNodeCardFields: (nodeId: string, data: CardFields) => {
      const newNodes = get().nodes.map((storeNode) =>
        storeNode.id === nodeId
          ? {
              ...storeNode,
              data: {
                ...storeNode.data,
                dbAction:
                  storeNode.data.dbAction === "create"
                    ? ("create" as DbAction)
                    : ("update" as DbAction),
                front: data.front,
                back: data.back,
              },
            }
          : storeNode
      );
      set({ nodes: newNodes });
    },
    setEdgeEditMode: (edgeId: string, editMode: boolean) => {
      const newEdges: LinkEdge[] = get().edges.map((storeEdge) =>
        storeEdge.id === edgeId && storeEdge.data
          ? { ...storeEdge, data: { ...storeEdge.data, editMode: editMode } }
          : storeEdge
      );
      set({ edges: newEdges });
    },
    setLinkEdgeFields: (edgeId: string, data: LinkFields) => {
      const newNodes = get().nodes.map((storeNode) =>
        storeNode.id === edgeId
          ? {
              ...storeNode,
              source: data.from,
              target: data.to,
              data: {
                ...storeNode.data,
                dbAction:
                  storeNode.data.dbAction === "create"
                    ? ("create" as DbAction)
                    : ("update" as DbAction),
                ...data,
              },
            }
          : storeNode
      );
      set({ nodes: newNodes });
    },
    onDeleteNode: (nodeId: string) => {
      const deletedNode = get().nodes.find(
        (storeNode) => storeNode.id === nodeId
      );
      if (deletedNode) {
        // Remove the node
        const newNodes = get().nodes.filter(
          (storeNode) => storeNode.id !== nodeId
        );
        set({ nodes: newNodes });

        if (deletedNode.data.dbAction !== "create")
          //oherwise it is just  local card, DB does not need to know about it
          set({ deletedNodes: [...get().deletedNodes, deletedNode] });

        // Find and remove connected edges
        const connectedEdges = get().edges.filter(
          (storeEdge) =>
            storeEdge.source === nodeId || storeEdge.target === nodeId
        );
        const newEdges = get().edges.filter(
          (storeEdge) =>
            storeEdge.source !== nodeId && storeEdge.target !== nodeId
        );
        set({ edges: newEdges });

        if (deletedNode.data.dbAction !== "create") {
          // Store deleted edges and update edges in a single state update, if deleted card is not just  local card
          const persistentConnectedEdges = connectedEdges.filter(
            (edge) => edge.data?.dbAction !== "create"
          );
          set({
            deletedEdges: [...get().deletedEdges, ...persistentConnectedEdges],
          });
        }
      }
    },
    onDeleteEdge: (edgeId: string) => {
      const deletedEdge = get().edges.find(
        (storeEdge) => storeEdge.id === edgeId
      );
      if (deletedEdge) {
        console.log("onDelete edge 2");
        // Remove the edge
        const newEdges = get().edges.filter(
          (storeEdge) => storeEdge.id !== edgeId
        );
        set({ deletedEdges: [...get().deletedEdges, deletedEdge] });
        set({ edges: newEdges });
      }
    },
  }))
);
