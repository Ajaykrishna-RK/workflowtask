import { FaPlus } from "react-icons/fa";
import Button from "../ui/Button";

export default function EmptyWorkflowState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-semibold mb-2">No Workflows Yet</h2>
        <p className="text-gray-400 mb-6">
          Get started by creating your first automation workflow.
        </p>

        <Button
          onClick={onCreate}
          variant="ghost"
          className="border border-gray-600 mx-auto"
        >
          <FaPlus />
          Create Your First Workflow
        </Button>
      </div>
    </div>
  );
}
