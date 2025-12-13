
import type { WorkflowState, WorkflowAction } from "./WorkflowTypes";
import type { WorkflowNode, Workflow } from "../../types/workflow";

export const loadWorkflowsFromStorage = (): Workflow[] => {
  try {
    return JSON.parse(localStorage.getItem("workflows") || "[]");
  } catch {
    return [];
  }
};

export const saveWorkflowsToStorage = (workflows: Workflow[]) => {
  localStorage.setItem("workflows", JSON.stringify(workflows));
};

export const updateNodeConfig = (
  nodes: WorkflowNode[],
  action: WorkflowAction
) => {
  if (action.type !== "UPDATE_NODE") return nodes;

  return nodes.map((node) =>
    node.id === action.payload.id
      ? { ...node, data: { ...node.data, config: action.payload.config } }
      : node
  );
};

export const deleteNode = (state: WorkflowState, id: string) => ({
  nodes: state.nodes.filter((n) => n.id !== id),
  edges: state.edges.filter((e) => e.source !== id && e.target !== id),
  selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
});
