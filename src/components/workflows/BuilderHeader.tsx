import Button from "../ui/Button";
import { FaSave, FaHome, FaPlay } from "react-icons/fa";

export default function BuilderHeader({
  workflowName,
  setWorkflowName,
  onHome,
  onAddStartTrigger,
  onExport,
  onSave,
}: {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  onHome: () => void;
  onAddStartTrigger: () => void;
  onExport: () => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button onClick={onHome} leftIcon={<FaHome className="text-xl" />} />

        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Workflow name"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="green" onClick={onAddStartTrigger} leftIcon={<FaPlay />}>
          Add Start Trigger
        </Button>

        <Button className="border border-gray-600" onClick={onExport}>Export JSON</Button>

        <Button variant="primary" onClick={onSave} leftIcon={<FaSave />}>
          Save
        </Button>
      </div>
    </div>
  );
}
