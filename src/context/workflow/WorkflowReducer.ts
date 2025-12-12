// src/context/workflow/workflowReducer.ts
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import {
  loadWorkflowsFromStorage,
  saveWorkflowsToStorage,
  updateNodeConfig,
  deleteNode,
} from "./WorkflowHelpers";

import type { WorkflowAction, WorkflowState } from "./WorkflowTypes";
import type { Workflow } from "../../types/workflow";

export function workflowReducer(
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState {
  switch (action.type) {
    case "SET_NODES":
      return { ...state, nodes: action.payload };

    case "SET_EDGES":
      return { ...state, edges: action.payload };

    case "ON_NODES_CHANGE":
      return {
        ...state,
        nodes: applyNodeChanges(action.payload, state.nodes) as any,
      };

    case "ON_EDGES_CHANGE":
      return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };

    case "ON_CONNECT":
      return { ...state, edges: addEdge(action.payload, state.edges) };

    case "ADD_NODE":
      return { ...state, nodes: [...state.nodes, action.payload] };

    case "UPDATE_NODE":
      return {
        ...state,
        nodes: updateNodeConfig(state.nodes, action),
        selectedNode:
          state.selectedNode?.id === action.payload.id
            ? {
                ...state.selectedNode,
                data: {
                  ...state.selectedNode.data,
                  config: action.payload.config,
                },
              }
            : state.selectedNode,
      };

    case "DELETE_NODE":
      return { ...state, ...deleteNode(state, action.payload) };

    case "SELECT_NODE":
      return { ...state, selectedNode: action.payload };

    case "LOAD_WORKFLOW":
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        currentWorkflowId: action.payload.id,
        selectedNode: null,
      };

    case "SAVE_WORKFLOW": {
      const workflow: Workflow = {
        id: state.currentWorkflowId || `workflow-${Date.now()}`,
        name: action.payload.name,
        nodes: state.nodes,
        edges: state.edges,
        createdAt:
          state.currentWorkflowId &&
          state.workflows.find((w) => w.id === state.currentWorkflowId)
            ?.createdAt
            ? state.workflows.find((w) => w.id === state.currentWorkflowId)!
                .createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = state.currentWorkflowId
        ? state.workflows.map((w) => (w.id === workflow.id ? workflow : w))
        : [...state.workflows, workflow];

      saveWorkflowsToStorage(updated);

      return { ...state, workflows: updated, currentWorkflowId: workflow.id };
    }

    case "LOAD_WORKFLOWS":
      return { ...state, workflows: loadWorkflowsFromStorage() };

    case "DELETE_WORKFLOW": {
      const updated = state.workflows.filter((w) => w.id !== action.payload);
      saveWorkflowsToStorage(updated);

      return {
        ...state,
        workflows: updated,
        currentWorkflowId:
          state.currentWorkflowId === action.payload
            ? null
            : state.currentWorkflowId,
      };
    }

    case "RESET_WORKFLOW":
      return {
        ...state,
        nodes: [],
        edges: [],
        selectedNode: null,
        currentWorkflowId: null,
        errors: [],
      };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    default:
      return state;
  }
}
