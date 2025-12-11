import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';
import type { Workflow } from '../types/workflow';
import { FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';

export default function WorkflowList() {
  const navigate = useNavigate();
  const { state, dispatch } = useWorkflow();
  const { workflows } = state;
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: 'LOAD_WORKFLOWS' });
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch({ type: 'RESET_WORKFLOW' });
    navigate('/workflow');
  };

  const handleEdit = (workflow: Workflow) => {
    dispatch({ type: 'LOAD_WORKFLOW', payload: workflow });
    navigate('/workflow');
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_WORKFLOW', payload: id });
    setShowDeleteModal(null);
  };

  const handleExport = (workflow: Workflow) => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (workflows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Workflow Builder</h1>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus />
              Create New Workflow
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold mb-2">No Workflows Yet</h2>
              <p className="text-gray-400 mb-6">
                Get started by creating your first automation workflow
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <FaPlus />
                Create Your First Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Workflow Builder</h1>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Create New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">{workflow.name}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {workflow.nodes.length} node{workflow.nodes.length !== 1 ? 's' : ''} •{' '}
                {workflow.edges.length} connection{workflow.edges.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Updated: {formatDate(workflow.updatedAt)}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(workflow)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleExport(workflow)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  title="Export"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => setShowDeleteModal(workflow.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Delete Workflow</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this workflow? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

