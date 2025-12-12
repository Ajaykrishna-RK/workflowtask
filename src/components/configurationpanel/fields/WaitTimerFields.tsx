import InputField from "../../ui/InputField";
import type { NodeConfig } from "../../../types/workflow";

export default function WaitTimerFields({
  config,
  errors,
  updateConfig,
}: {
  config: NodeConfig;
  errors: Record<string, string>;
  updateConfig: (field: keyof NodeConfig, value: any, error?: string) => void;
}) {
  const validateTimer = (hrs: number, mins: number) =>
    hrs === 0 && mins === 0 ? "At least one time value is required" : "";

  return (
    <div className="space-y-4">
      
      <InputField
        label="Hours"
        type="number"
        value={config.hours ?? ""}
        min={0}
        error={errors.timer}
        onChange={(val) => {
          const hrs = val === "" ? "" : Number(val);
          const mins = config.minutes ?? 0;

          updateConfig("hours", hrs, validateTimer(Number(hrs || 0), mins));
        }}
      />

      <InputField
        label="Minutes"
        type="number"
        value={config.minutes ?? ""}
        min={0}
        max={59}
        error={errors.timer}
        onChange={(val) => {
          const mins = val === "" ? "" : Number(val);
          const hrs = config.hours ?? 0;

          updateConfig("minutes", mins, validateTimer(hrs, Number(mins || 0)));
        }}
      />

      {/* Global Timer Error */}
      {errors.timer && (
        <p className="text-red-400 text-xs">{errors.timer}</p>
      )}
    </div>
  );
}
