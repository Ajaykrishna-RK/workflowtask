import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";

import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

import type {
  Workflow,
  WorkflowNode,
  NodeConfig,
  WorkflowValidationError,
} from "../types/workflow";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNode: WorkflowNode | null;
  workflows: Workflow[];
  currentWorkflowId: string | null;
  errors: WorkflowValidationError[];
}

type WorkflowAction =
  | { type: "SET_NODES"; payload: WorkflowNode[] }
  | { type: "SET_EDGES"; payload: Edge[] }
  | { type: "ON_NODES_CHANGE"; payload: NodeChange[] }
  | { type: "ON_EDGES_CHANGE"; payload: EdgeChange[] }
  | { type: "ON_CONNECT"; payload: Connection }
  | { type: "ADD_NODE"; payload: WorkflowNode }
  | { type: "UPDATE_NODE"; payload: { id: string; config: NodeConfig } }
  | { type: "DELETE_NODE"; payload: string }
  | { type: "SELECT_NODE"; payload: WorkflowNode | null }
  | { type: "LOAD_WORKFLOW"; payload: Workflow }
  | { type: "SAVE_WORKFLOW"; payload: { name: string } }
  | { type: "LOAD_WORKFLOWS" }
  | { type: "DELETE_WORKFLOW"; payload: string }
  | { type: "RESET_WORKFLOW" }
  | { type: "SET_ERRORS"; payload: WorkflowValidationError[] };

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  workflows: [],
  currentWorkflowId: null,
  errors: [],
};

function workflowReducer(
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
        nodes: applyNodeChanges(action.payload, state.nodes) as WorkflowNode[],
      };

    case "ON_EDGES_CHANGE":
      return {
        ...state,
        edges: applyEdgeChanges(action.payload, state.edges),
      };

    case "ON_CONNECT":
      return {
        ...state,
        edges: addEdge(action.payload, state.edges),
      };

    case "ADD_NODE":
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };

    case "UPDATE_NODE":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.id
            ? { ...node, data: { ...node.data, config: action.payload.config } }
            : node
        ),
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
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter(
          (edge) =>
            edge.source !== action.payload && edge.target !== action.payload
        ),
        selectedNode:
          state.selectedNode?.id === action.payload ? null : state.selectedNode,
      };

    case "SELECT_NODE":
      return {
        ...state,
        selectedNode: action.payload,
      };

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
        createdAt: state.currentWorkflowId
          ? state.workflows.find((w) => w.id === state.currentWorkflowId)
              ?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const workflows = state.currentWorkflowId
        ? state.workflows.map((w) => (w.id === workflow.id ? workflow : w))
        : [...state.workflows, workflow];

      localStorage.setItem("workflows", JSON.stringify(workflows));

      return {
        ...state,
        workflows,
        currentWorkflowId: workflow.id,
      };
    }

    case "LOAD_WORKFLOWS": {
      const stored = localStorage.getItem("workflows");
      const workflows = stored ? JSON.parse(stored) : [];
      return { ...state, workflows };
    }

    case "DELETE_WORKFLOW": {
      const workflows = state.workflows.filter((w) => w.id !== action.payload);
      localStorage.setItem("workflows", JSON.stringify(workflows));
      return {
        ...state,
        workflows,
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
      return {
        ...state,
        errors: action.payload,
      };

    default:
      return state;
  }
}

interface WorkflowContextType {
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

useEffect(() => {
    dispatch({ type: "LOAD_WORKFLOWS" });
  }, []);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
