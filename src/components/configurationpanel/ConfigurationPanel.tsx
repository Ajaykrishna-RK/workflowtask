import { useEffect, useState } from "react";
import { useWorkflow } from "../../context/WorkflowContext";
import type { NodeConfig } from "../../types/workflow";
import { FaTimes } from "react-icons/fa";
import SendMessageFields from "./fields/SendMessageFields";
import ConditionFields from "./fields/ConditionFields";
import WaitTimerFields from "./fields/WaitTimerFields";
import FollowUserFields from "./fields/FollowUserFields";
import StartTriggerFields from "./fields/StartTriggerFields";
import Button from "../ui/Button";


export default function ConfigurationPanel() {
  const { state, dispatch } = useWorkflow();
  const { selectedNode } = state;

  const [config, setConfig] = useState<NodeConfig>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
      setErrors({});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-800 text-white p-4 h-full flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Select a node to configure it
        </p>
      </div>
    );
  }

  const updateConfig = (
    field: keyof NodeConfig,
    value: any,
    errorMsg?: string
  ) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);

    const newErrors = { ...errors };
    if (errorMsg) newErrors[field] = errorMsg;
    else delete newErrors[field];

    setErrors(newErrors);

    dispatch({
      type: "UPDATE_NODE",
      payload: { id: selectedNode.id, config: newConfig },
    });
  };

  const renderFields = () => {
    const props = { config, errors, updateConfig };

    switch (selectedNode.type) {
      case "sendMessage":
        return <SendMessageFields {...props} />;

      case "condition":
        return <ConditionFields {...props} />;

      case "waitTimer":
        return <WaitTimerFields {...props} />;

      case "followUser":
        return <FollowUserFields />;

      case "startTrigger":
        return <StartTriggerFields />;

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-gray-800 text-white p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Configure Node</h2>
        <Button
          onClick={() => dispatch({ type: "SELECT_NODE", payload: null })}
        >
          {" "}
          <FaTimes />
        </Button>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-700">
        <p className="text-sm text-gray-400">Node Type</p>
        <p className="font-semibold">{selectedNode.data.label}</p>
      </div>

      {renderFields()}
    </div>
  );
}
