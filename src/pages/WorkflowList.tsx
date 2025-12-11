import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkflow } from "../context/WorkflowContext";
import type { Workflow } from "../types/workflow";

import WorkflowListHeader from "../components/workflows/WorkflowListHeader";
import WorkflowCard from "../components/workflows/WorkflowCard";
import EmptyWorkflowState from "../components/workflows/EmptyWorkflowState";
import Modal from "../components/ui/Modal";

export default function WorkflowList() {
  const navigate = useNavigate();
  const { state, dispatch } = useWorkflow();
  const { workflows } = state;

  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: "LOAD_WORKFLOWS" });
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch({ type: "RESET_WORKFLOW" });
    navigate("/workflow");
  };

  const handleEdit = (workflow: Workflow) => {
    dispatch({ type: "LOAD_WORKFLOW", payload: workflow });
    navigate("/workflow");
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_WORKFLOW", payload: id });
    setShowDeleteModal(null);
  };

  const handleExport = (workflow: Workflow) => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (workflows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <WorkflowListHeader onCreate={handleCreateNew} />
          <EmptyWorkflowState onCreate={handleCreateNew} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <WorkflowListHeader onCreate={handleCreateNew} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onEdit={handleEdit}
              onExport={handleExport}
              onDelete={() => setShowDeleteModal(workflow.id)}
            />
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        open={!!showDeleteModal}
        title="Delete Workflow"
        message="Are you sure you want to delete this workflow? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (showDeleteModal) handleDelete(showDeleteModal);
        }}
        onCancel={() => setShowDeleteModal(null)}
      />
    </div>
  );
}
