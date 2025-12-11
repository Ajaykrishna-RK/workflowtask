import type { WorkflowNode, WorkflowValidationError } from '../types/workflow';
import type { Edge } from '@xyflow/react';


export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: Edge[]
): WorkflowValidationError[] {
  const errors: WorkflowValidationError[] = [];

  if (nodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have at least one node',
    });
    return errors;
  }


  const startTriggers = nodes.filter((node) => node.type === 'startTrigger');
  if (startTriggers.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have exactly one Start Trigger',
    });
  } else if (startTriggers.length > 1) {
    errors.push({
      type: 'error',
      message: 'Workflow can only have one Start Trigger',
    });
  }


  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  nodes.forEach((node) => {
    if (node.type !== 'startTrigger' && !connectedNodeIds.has(node.id)) {
      errors.push({
        type: 'error',
        message: `Node "${node.data.label}" is isolated and not connected to the workflow`,
      });
    }
  });


  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(nodeId: string, graph: Map<string, string[]>): boolean {
    if (recStack.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor, graph)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  const graph = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);
  });


  for (const node of nodes) {
    if (!visited.has(node.id) && hasCycle(node.id, graph)) {
      errors.push({
        type: 'error',
        message: 'Workflow contains cycles/loops which are not allowed',
      });
      break;
    }
  }

  const outgoingCount = new Map<string, number>();
  edges.forEach((edge) => {
    outgoingCount.set(edge.source, (outgoingCount.get(edge.source) || 0) + 1);
  });

  outgoingCount.forEach((count, nodeId) => {
    if (count > 1) {
      const node = nodes.find((n) => n.id === nodeId);
      errors.push({
        type: 'error',
        message: `Node "${node?.data.label || nodeId}" has multiple outgoing connections. Branching is not allowed`,
      });
    }
  });


  const incomingCount = new Map<string, number>();
  edges.forEach((edge) => {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1);
  });

  incomingCount.forEach((count, nodeId) => {
    if (count > 1) {
      const node = nodes.find((n) => n.id === nodeId);
      if (node?.type !== 'startTrigger') {
        errors.push({
          type: 'error',
          message: `Node "${node?.data.label || nodeId}" has multiple incoming connections. Only linear workflows are allowed`,
        });
      }
    }
  });

  // Validate node configurations
  nodes.forEach((node) => {
    const config = node.data.config;
    
    if (node.type === 'sendMessage') {
      if (!config?.username?.trim()) {
        errors.push({
          type: 'error',
          message: `Node "${node.data.label}" requires a username`,
        });
      }
      if (!config?.message?.trim()) {
        errors.push({
          type: 'error',
          message: `Node "${node.data.label}" requires a message`,
        });
      }
    }
    
    if (node.type === 'condition') {
      if (!config?.conditionType) {
        errors.push({
          type: 'error',
          message: `Node "${node.data.label}" requires a condition type`,
        });
      }
      if (!config?.conditionValue?.trim()) {
        errors.push({
          type: 'error',
          message: `Node "${node.data.label}" requires a condition value`,
        });
      }
    }
    
    if (node.type === 'waitTimer') {
      const hours = config?.hours || 0;
      const minutes = config?.minutes || 0;
      if (hours === 0 && minutes === 0) {
        errors.push({
          type: 'error',
          message: `Node "${node.data.label}" requires at least one time value (hours or minutes)`,
        });
      }
    }
  });

  return errors;
}

