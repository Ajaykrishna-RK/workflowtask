import InputField from "../../ui/InputField";
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
      <InputField
        label="Username"
        required
        value={config.username ?? ""}
        error={errors.username}
        placeholder="Enter username"
        onChange={(val) =>
          updateConfig(
            "username",
            val,
            val.trim() ? "" : "Username is required"
          )
        }
      />

      <InputField
        label="Message"
        required
        type="textarea"
        value={config.message ?? ""}
        error={errors.message}
        placeholder="Enter message content"
        onChange={(val) =>
          updateConfig(
            "message",
            val,
            val.trim() ? "" : "Message is required"
          )
        }
      />
    </div>
  );
}
