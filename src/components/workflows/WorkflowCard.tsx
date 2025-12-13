
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import type { Workflow } from "../../types/workflow";
import Button from "../ui/Button";

export default function WorkflowCard({
  workflow,
  onEdit,
  onExport,
  onDelete,
}: {
  workflow: Workflow;
  onEdit: (workflow: Workflow) => void;
  onExport: (workflow: Workflow) => void;
  onDelete: (workflow: Workflow) => void;
}) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700">
      <h3 className="text-xl font-semibold mb-2">{workflow.name}</h3>

      <p className="text-sm text-gray-400 mb-4">
        {workflow.nodes.length} node{workflow.nodes.length !== 1 ? "s" : ""} •{" "}
        {workflow.edges.length} connection
        {workflow.edges.length !== 1 ? "s" : ""}
      </p>

      <p className="text-xs text-gray-500 mb-4">
        Updated: {formatDate(workflow.updatedAt)}
      </p>

      <div className="flex gap-2">
        <Button className="border border-gray-600"  onClick={() => onEdit(workflow)} leftIcon={<FaEdit />}  >Edit</Button>
      
<Button className="border border-gray-600"  onClick={() => onExport(workflow)} leftIcon={<FaDownload />}> Export </Button>
     
<Button  variant="danger"   onClick={() => onDelete(workflow)} leftIcon={  <FaTrash />}> Delete </Button>
     
      </div>
    </div>
  );
}
