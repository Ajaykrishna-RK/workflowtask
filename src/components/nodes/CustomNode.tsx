import  { Handle, Position } from '@xyflow/react';
import type {  NodeProps } from '@xyflow/react';
import  type { WorkflowNode } from '../../types/workflow';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  FaPlay, 
  FaCodeBranch, 
  FaClock, 
  FaEnvelope, 
  FaUserPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const nodeIcons = {
  startTrigger: FaPlay,
  condition: FaCodeBranch,
  waitTimer: FaClock,
  sendMessage: FaEnvelope,
  followUser: FaUserPlus,
};

const nodeColors = {
  startTrigger: 'bg-green-500',
  condition: 'bg-blue-500',
  waitTimer: 'bg-yellow-500',
  sendMessage: 'bg-purple-500',
  followUser: 'bg-pink-500',
};

export default function CustomNode({ data, id, type }: NodeProps<WorkflowNode>) {
  const { dispatch } = useWorkflow();
  const Icon = nodeIcons[type as keyof typeof nodeIcons] || FaPlay;
  const colorClass = nodeColors[type as keyof typeof nodeColors] || 'bg-gray-500';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = { id, data, type: type as any };
    dispatch({ type: 'SELECT_NODE', payload: node as WorkflowNode });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
      dispatch({ type: 'DELETE_NODE', payload: id });
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 border-white min-w-[180px] ${colorClass} text-white`}>
      {type !== 'startTrigger' && (
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-lg" />
        <h3 className="font-semibold text-sm">{data.label}</h3>
      </div>
      
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleEdit}
          className="flex-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs transition-colors"
          title="Edit"
        >
          <FaEdit className="inline mr-1" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500/80 hover:bg-red-600 px-2 py-1 rounded text-xs transition-colors"
          title="Delete"
        >
          <FaTrash className="inline mr-1" />
          Delete
        </button>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

