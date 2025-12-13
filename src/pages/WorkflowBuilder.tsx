import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { useWorkflow } from "../context/WorkflowContext";
import WorkflowCanvas from "../components/WorkflowCanvas";
import Sidebar from "../components/Sidebar";
import ConfigurationPanel from "../components/configurationpanel/ConfigurationPanel";
import { ToastContainer } from "../components/Toast";
import { validateWorkflow } from "../utils/validation";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import BuilderHeader from "../components/workflows/BuilderHeader";

export default function WorkflowBuilder() {
  const navigate = useNavigate();
  const { state, dispatch } = useWorkflow();
  const { nodes, edges, errors, currentWorkflowId, workflows } = state;
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonPreview, setJsonPreview] = useState("");

  useEffect(() => {
    if (currentWorkflowId) {
      const workflow = workflows.find((w) => w.id === currentWorkflowId);
      if (workflow) {
        setWorkflowName(workflow.name);
      }
    } else {
      setWorkflowName("Untitled Workflow");
    }
  }, [currentWorkflowId, workflows]);

  const handleAddStartTrigger = () => {
    const hasStartTrigger = nodes.some((node) => node.type === "startTrigger");
    if (hasStartTrigger) {
      dispatch({
        type: "SET_ERRORS",
        payload: [
          { type: "error", message: "Only one Start Trigger is allowed" },
        ],
      });
      return;
    }

    const newNode = {
      id: `startTrigger-${Date.now()}`,
      type: "startTrigger" as const,
      position: { x: 250, y: 100 },
      data: {
        label: "Start Trigger",
        config: {},
      },
    };

    dispatch({ type: "ADD_NODE", payload: newNode });
  };

  const handleSave = () => {
    const validationErrors = validateWorkflow(nodes, edges);

    if (validationErrors.length > 0) {
      setSaveErrors(validationErrors.map((e) => e.message));
      setShowSaveModal(true);
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
      return;
    }

    if (!workflowName.trim()) {
      setSaveErrors(["Workflow name is required"]);
      setShowSaveModal(true);
      return;
    }

    dispatch({ type: "SAVE_WORKFLOW", payload: { name: workflowName.trim() } });
    setShowSaveModal(false);
    setSaveErrors([]);

    dispatch({
      type: "SET_ERRORS",
      payload: [{ type: "warning", message: "Workflow saved successfully!" }],
    });

    setTimeout(() => {
      dispatch({ type: "SET_ERRORS", payload: [] });
    }, 2000);
  };

  const handleExport = () => {
    const validationErrors = validateWorkflow(nodes, edges);

    if (validationErrors.length > 0) {
      setSaveErrors(validationErrors.map((e) => e.message));
      setShowSaveModal(true);
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
      return;
    }

    const workflowData = {
      name: workflowName || "Untitled Workflow",
      nodes,
      edges,
    };

    setJsonPreview(JSON.stringify(workflowData, null, 2));
    setShowJsonModal(true);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "-")}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleCloseError = (index: number) => {
    const newErrors = errors.filter((_, i) => i !== index);
    dispatch({ type: "SET_ERRORS", payload: newErrors });
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <BuilderHeader
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          onHome={() => navigate("/")}
          onAddStartTrigger={handleAddStartTrigger}
          onExport={handleExport}
          onSave={handleSave}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 relative">
            <WorkflowCanvas />
          </div>
          <ConfigurationPanel />
        </div>

        {/* Toast Notifications */}
        <ToastContainer errors={errors} onClose={handleCloseError} />

        {/* Delete Node Modal */}
        <Modal
          open={!!state.nodeToDelete}
          title="Delete Node"
          message={`Are you sure you want to delete "${state.nodeToDelete?.data.label}"?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            dispatch({ type: "DELETE_NODE", payload: state.nodeToDelete!.id });
            dispatch({ type: "CONFIRM_DELETE_NODE", payload: null });
          }}
          onCancel={() =>
            dispatch({ type: "CONFIRM_DELETE_NODE", payload: null })
          }
        />

        {/* Save Error Modal */}
        <Modal
          open={showSaveModal}
          title="Cannot Save Workflow"
          onCancel={() => {
            setShowSaveModal(false);
            setSaveErrors([]);
          }}
        >
          <p className="text-gray-400 mb-4">
            Please fix the following errors before saving:
          </p>

          <ul className="list-disc list-inside text-red-400 mb-6 space-y-1">
            {saveErrors.map((err, idx) => (
              <li key={idx} className="text-sm">
                {err}
              </li>
            ))}
          </ul>
        </Modal>

        {/* Export JSON Modal */}
        <Modal
          open={showJsonModal}
          title="Export Workflow JSON"
          onCancel={() => setShowJsonModal(false)}
        >
          <div className="mb-4 text-gray-300">
            <p className="text-sm mb-2">
              Review the JSON below before downloading:
            </p>
          </div>

          <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-sm text-green-300 max-h-64 overflow-auto mb-4">
            {jsonPreview}
          </pre>

          <Button onClick={downloadJson} variant="green" fullWidth>
            Download JSON
          </Button>
        </Modal>
      </div>
    </ReactFlowProvider>
  );
}
