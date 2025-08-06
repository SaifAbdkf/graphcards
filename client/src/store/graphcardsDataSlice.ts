import { StateCreator } from "zustand";
import { GraphcardsDataSlice } from "../Types/storeTypes";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
} from "@xyflow/react";
import { DbAction } from "../Types/storageManagementTypes";
import {
  CardFields,
  CardNode,
  DeckInfo,
  LinkEdge,
} from "../Types/appDataTypes";
import { ObjectId } from "bson";
import { useGraphcardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createGraphcardsDataSlice: StateCreator<GraphcardsDataSlice> = (
  set,
  get
) => ({
  nodes: [],
  EditingNodeId: null,
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
          const position = change.position;
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
                      x: position.x,
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
    console.log("edge change", changes);
    const edgeSelectionChange = changes.filter(
      (change) => change.type === "select"
    );

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    console.log("------", get().edges);

    // case: edge was selected and have editMode true.
    const newEdges = get().edges.map((storeEdge) =>
      storeEdge.id === edgeSelectionChange[0].id &&
      !edgeSelectionChange[0].selected &&
      storeEdge.data !== undefined
        ? {
            ...storeEdge,
            data: { ...storeEdge.data, editMode: false },
          }
        : storeEdge
    );
    set({
      edges: newEdges,
    });
  },
  onConnect: (connection: Connection) => {
    console.log(connection);
    // Access activeDeckInfo from the full store state
    const storeState = get() as GraphcardsDataSlice & {
      activeDeckInfo: DeckInfo;
    };
    const edgeId = new ObjectId().toHexString();

    const newEdge: LinkEdge = {
      ...connection,
      id: edgeId,
      type: "LinkEdge",
      selected: true,
      data: {
        deckId: storeState.activeDeckInfo._id,
        _id: edgeId,
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
    set({ EditingNodeId: editMode ? nodeId : null });

    const newNodes = get().nodes.map((storeNode) =>
      storeNode.id === nodeId
        ? { ...storeNode, data: { ...storeNode.data, editMode: editMode } }
        : storeNode
    );
    set({ nodes: newNodes });
  },
  editNodeCardFields: (nodeId: string, data: CardFields) => {
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
              leitnerBox: data.leitnerBox,
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
  editLinkEdgeLabel: (edgeId: string, newLabel: string) => {
    const newEdges = get().edges.map((storeEdge) =>
      storeEdge.id === edgeId && storeEdge.data !== undefined
        ? {
            ...storeEdge,
            data: {
              ...storeEdge.data,
              dbAction:
                storeEdge.data.dbAction === "create"
                  ? ("create" as DbAction)
                  : ("update" as DbAction),
              label: newLabel,
            },
          }
        : storeEdge
    );
    set({ edges: newEdges });
  },
  deleteNode: (nodeId: string) => {
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
  deleteEdge: (edgeId: string) => {
    const deletedEdge = get().edges.find(
      (storeEdge) => storeEdge.id === edgeId
    );
    if (deletedEdge) {
      const newEdges = get().edges.filter(
        (storeEdge) => storeEdge.id !== edgeId
      );
      if (deletedEdge.data?.dbAction !== "create")
        set({ deletedEdges: [...get().deletedEdges, deletedEdge] });
      set({ edges: newEdges });
    }
  },
});

export function useActiveGraphcard() {
  const {
    nodes,
    edges,
    editingNodeId,
    setNodeEditMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setEdgeEditMode,
  } = useGraphcardsStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      editingNodeId: state.EditingNodeId,
      setNodeEditMode: state.setNodeEditMode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addNode: state.addNode,
      setEdgeEditMode: state.setEdgeEditMode,
    }))
  );

  return {
    nodes,
    edges,
    editingNodeId,
    setNodeEditMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setEdgeEditMode,
  };
}
