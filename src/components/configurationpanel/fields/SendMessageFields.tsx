import type { NodeConfig } from "../../../types/workflow";

export default function SendMessageFields({
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
      {/* Username */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Username <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={config.username || ""}
          onChange={(e) =>
            updateConfig(
              "username",
              e.target.value,
              e.target.value.trim() ? "" : "Username is required"
            )
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.username && (
          <p className="text-red-400 text-xs mt-1">{errors.username}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          value={config.message || ""}
          onChange={(e) =>
            updateConfig(
              "message",
              e.target.value,
              e.target.value.trim() ? "" : "Message is required"
            )
          }
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white min-h-[100px]"
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1">{errors.message}</p>
        )}
      </div>
    </div>
  );
}
