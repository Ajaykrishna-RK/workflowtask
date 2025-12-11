import { useCallback } from 'react';
import type { NodeType } from '../types/workflow';
import { 
  FaCodeBranch, 
  FaClock, 
  FaEnvelope, 
  FaUserPlus 
} from 'react-icons/fa';

interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: typeof FaCodeBranch;
  color: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'condition',
    label: 'Condition',
    icon: FaCodeBranch,
    color: 'bg-blue-500',
  },
  {
    type: 'sendMessage',
    label: 'Send Message',
    icon: FaEnvelope,
    color: 'bg-purple-500',
  },
  {
    type: 'followUser',
    label: 'Follow User',
    icon: FaUserPlus,
    color: 'bg-pink-500',
  },
  {
    type: 'waitTimer',
    label: 'Wait Timer',
    icon: FaClock,
    color: 'bg-yellow-500',
  },
];

export default function Sidebar() {
  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeType, label: string) => {
      event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Node Templates</h2>
      <p className="text-sm text-gray-400 mb-4">
        Drag nodes onto the canvas to add them to your workflow
      </p>
      
      <div className="space-y-3">
        {nodeTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type, template.label)}
              className={`${template.color} p-4 rounded-lg cursor-move hover:opacity-80 transition-opacity shadow-md`}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-2xl" />
                <span className="font-semibold">{template.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

