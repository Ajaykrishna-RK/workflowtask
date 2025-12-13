import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { WorkflowNode } from "../../types/workflow";
import { useWorkflow } from "../../context/WorkflowContext";
import {
  FaPlay,
  FaCodeBranch,
  FaClock,
  FaEnvelope,
  FaUserPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useState } from "react";

const nodeIcons = {
  startTrigger: FaPlay,
  condition: FaCodeBranch,
  waitTimer: FaClock,
  sendMessage: FaEnvelope,
  followUser: FaUserPlus,
};

const nodeColors = {
  startTrigger: "bg-green-500",
  condition: "bg-blue-500",
  waitTimer: "bg-yellow-500",
  sendMessage: "bg-purple-500",
  followUser: "bg-pink-500",
};

export default function CustomNode({
  data,
  id,
  type,
}: NodeProps<WorkflowNode>) {
  const { dispatch } = useWorkflow();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const Icon = nodeIcons[type as keyof typeof nodeIcons] || FaPlay;
  const colorClass =
    nodeColors[type as keyof typeof nodeColors] || "bg-gray-500";

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "SELECT_NODE",
      payload: { id, data, type } as WorkflowNode,
    });
  };

 const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CONFIRM_DELETE_NODE",
      payload: { id, data, type } as WorkflowNode,
    });
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 border-white min-w-[180px] ${colorClass} text-white`}
    >
      {type !== "startTrigger" && (
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
      )}

      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-lg" />
        <h3 className="font-semibold text-sm">{data.label}</h3>
      </div>

      <div className="flex gap-2 mt-2">
        <Button onClick={handleEdit} variant="secondary" leftIcon={<FaEdit />}>
          Edit
        </Button>

        <Button
          onClick={handleDeleteClick}
          variant="danger"
          leftIcon={<FaTrash />}
        >
          Delete
        </Button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />

    
      <Modal
        open={showDeleteModal}
        title="Delete Node"
        message="Are you sure you want to delete this node?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          dispatch({ type: "DELETE_NODE", payload: id });
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
