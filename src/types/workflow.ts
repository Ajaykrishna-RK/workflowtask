import type { Node, Edge } from '@xyflow/react';


export type NodeType = 
  | 'startTrigger'
  | 'condition'
  | 'waitTimer'
  | 'sendMessage'
  | 'followUser';

export interface WorkflowNode extends Node {
  type: NodeType;
  data: {
    label: string;
    icon?: string;
    config?: NodeConfig;
  };
}

export interface NodeConfig {

  username?: string;
  message?: string;
  

  conditionType?: string;
  conditionValue?: string;
  

  hours?: number;
  minutes?: number;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowValidationError {
  type: 'error' | 'warning';
  message: string;
}

