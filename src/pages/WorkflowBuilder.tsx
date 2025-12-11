import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { useWorkflow } from "../context/WorkflowContext";
import WorkflowCanvas from "../components/WorkflowCanvas";
import Sidebar from "../components/Sidebar";
import ConfigurationPanel from "../components/configurationpanel/ConfigurationPanel";
import { ToastContainer } from "../components/Toast";
import { validateWorkflow } from "../utils/validation";
import { FaSave, FaHome, FaPlay } from "react-icons/fa";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

export default function WorkflowBuilder() {
  const navigate = useNavigate();
  const { state, dispatch } = useWorkflow();
  const { nodes, edges, errors, currentWorkflowId, workflows } = state;
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);

  // Load workflow name when editing
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

  // Add Start Trigger button handler
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

    // Show success message
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

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workflowName.replace(/\s+/g, "-")}.json`;
    link.click();
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
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              leftIcon={<FaHome className="text-xl" />}
            ></Button>

            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Workflow name"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="green"
              onClick={handleAddStartTrigger}
              leftIcon={<FaPlay />}
            >
              {" "}
              Add Start Trigger{" "}
            </Button>
            <Button onClick={handleExport}> Export JSON </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              leftIcon={<FaSave />}
            >
              {" "}
              Save{" "}
            </Button>
          </div>
        </div>

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
      </div>
    </ReactFlowProvider>
  );
}
