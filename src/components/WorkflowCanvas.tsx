import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,

  MiniMap,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import type { NodeTypes, Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./nodes/CustomNode";
import { useWorkflow } from "../context/WorkflowContext";
import type { WorkflowNode, NodeType } from "../types/workflow";
import { validateWorkflow } from "../utils/validation";

const nodeTypes: NodeTypes = {
  startTrigger: CustomNode,
  condition: CustomNode,
  waitTimer: CustomNode,
  sendMessage: CustomNode,
  followUser: CustomNode,
};

export default function WorkflowCanvas() {
  const { state, dispatch } = useWorkflow();
  const { nodes, edges } = state;
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: any) => {
      dispatch({ type: "ON_NODES_CHANGE", payload: changes });
    },

    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      dispatch({ type: "ON_EDGES_CHANGE", payload: changes });
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (params: Connection) => {

      const newEdges = addEdge(params, edges);
      const validationErrors = validateWorkflow(nodes, newEdges);

      if (validationErrors.length > 0) {
        dispatch({ type: "SET_ERRORS", payload: validationErrors });
        return;
      }

      dispatch({ type: "ON_CONNECT", payload: params });
      dispatch({ type: "SET_ERRORS", payload: [] });
    },
    [dispatch, nodes, edges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const { type, label } = JSON.parse(data);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });


      if (type === "startTrigger") {
        const hasStartTrigger = nodes.some(
          (node) => node.type === "startTrigger"
        );
        if (hasStartTrigger) {
          dispatch({
            type: "SET_ERRORS",
            payload: [
              { type: "error", message: "Only one Start Trigger is allowed" },
            ],
          });
          return;
        }
      }

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type: type as NodeType,
        position,
        data: {
          label,
          config: {},
        },
      };

      dispatch({ type: "ADD_NODE", payload: newNode });
    },
    [screenToFlowPosition, dispatch, nodes]
  );


  useEffect(() => {
    const handleAddNode = (event: CustomEvent) => {
      const newNode = event.detail as WorkflowNode;

   
      if (newNode.type === "startTrigger") {
        const hasStartTrigger = nodes.some(
          (node) => node.type === "startTrigger"
        );
        if (hasStartTrigger) {
          dispatch({
            type: "SET_ERRORS",
            payload: [
              { type: "error", message: "Only one Start Trigger is allowed" },
            ],
          });
          return;
        }
      }

      dispatch({ type: "ADD_NODE", payload: newNode });
    };

    window.addEventListener("addNode", handleAddNode as EventListener);
    return () => {
      window.removeEventListener("addNode", handleAddNode as EventListener);
    };
  }, [dispatch, nodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-900"
      >
        <Background />

        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              startTrigger: "#10b981",
              condition: "#3b82f6",
              waitTimer: "#eab308",
              sendMessage: "#a855f7",
              followUser: "#ec4899",
            };
            return colors[node.type || ""] || "#6b7280";
          }}
          className="bg-gray-800"
        />
      </ReactFlow>
    </div>
  );
}
