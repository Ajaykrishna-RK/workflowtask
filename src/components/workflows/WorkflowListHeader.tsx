
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
       className="border border-gray-600"
      >
       
        Create New Workflow
      </Button>
    </div>
  );
}
