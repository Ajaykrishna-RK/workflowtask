import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import type { NodeConfig } from "../../../types/workflow";

export default function ConditionFields({
  config,
  errors,
  updateConfig,
}: {
  config: NodeConfig;
  errors: Record<string, string>;
  updateConfig: (field: keyof NodeConfig, value: any, error?: string) => void;
}) {
  return (
    <div className="space-y-4">


      <SelectField
        label="Condition Type"
        required
        value={config.conditionType || ""}
        error={errors.conditionType}
        options={[
          { label: "Select...", value: "" },
          { label: "Equals", value: "equals" },
          { label: "Not Equals", value: "notEquals" },
          { label: "Greater Than", value: "greaterThan" },
          { label: "Less Than", value: "lessThan" },
          { label: "Contains", value: "contains" },
        ]}
        onChange={(val) =>
          updateConfig(
            "conditionType",
            val,
            val ? "" : "Condition type is required"
          )
        }
      />


      <InputField
        label="Condition Value"
        required
        value={config.conditionValue || ""}
        error={errors.conditionValue}
        placeholder="Enter condition value"
        onChange={(val) =>
          updateConfig(
            "conditionValue",
            val,
            val.trim() ? "" : "Condition value is required"
          )
        }
      />

    </div>
  );
}
