// components/workflows/WorkflowListHeader.tsx
import { FaPlus } from "react-icons/fa";
import Button from "../ui/Button";

export default function WorkflowListHeader({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Workflow Builder</h1>

      <Button
      leftIcon={ <FaPlus />}
        onClick={onCreate}
        // className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
      >
       
        Create New Workflow
      </Button>
    </div>
  );
}
