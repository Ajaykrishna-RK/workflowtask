import type { NodeChange, EdgeChange, Connection, Edge } from "@xyflow/react";
import type { WorkflowNode, WorkflowValidationError, NodeConfig, Workflow } from "../../types/workflow";

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNode: WorkflowNode | null;
  workflows: Workflow[];
  currentWorkflowId: string | null;
  errors: WorkflowValidationError[];
}

export type WorkflowAction =
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

export const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  workflows: [],
  currentWorkflowId: null,
  errors: [],
};
