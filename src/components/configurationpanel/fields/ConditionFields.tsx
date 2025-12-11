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
      {/* Condition Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Condition Type <span className="text-red-400">*</span>
        </label>
        <select
          value={config.conditionType || ""}
          onChange={(e) =>
            updateConfig(
              "conditionType",
              e.target.value,
              e.target.value ? "" : "Condition type is required"
            )
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="">Select...</option>
          <option value="equals">Equals</option>
          <option value="notEquals">Not Equals</option>
          <option value="greaterThan">Greater Than</option>
          <option value="lessThan">Less Than</option>
          <option value="contains">Contains</option>
        </select>
        {errors.conditionType && (
          <p className="text-red-400 text-xs mt-1">{errors.conditionType}</p>
        )}
      </div>

      {/* Condition Value */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Condition Value <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={config.conditionValue || ""}
          onChange={(e) =>
            updateConfig(
              "conditionValue",
              e.target.value,
              e.target.value.trim() ? "" : "Condition value is required"
            )
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.conditionValue && (
          <p className="text-red-400 text-xs mt-1">{errors.conditionValue}</p>
        )}
      </div>
    </div>
  );
}
