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
  const validateTimer = (hrs: number, mins: number) => {
    return hrs === 0 && mins === 0 ? "At least one time value is required" : "";
  };

  return (
    <div className="space-y-4">
      {/* Hours */}
      <div>
        <label className="block text-sm font-medium mb-2">Hours</label>
        <input
          type="number"
          min="0"
          value={config.hours || 0}
          onChange={(e) => {
            const hrs = Number(e.target.value);
            const mins = config.minutes || 0;

            updateConfig(
              "hours",
              hrs,
              validateTimer(hrs, mins)
            );
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>

      {/* Minutes */}
      <div>
        <label className="block text-sm font-medium mb-2">Minutes</label>
        <input
          type="number"
          min="0"
          max="59"
          value={config.minutes || 0}
          onChange={(e) => {
            const mins = Number(e.target.value);
            const hrs = config.hours || 0;

            updateConfig(
              "minutes",
              mins,
              validateTimer(hrs, mins)
            );
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>

      {errors.timer && (
        <p className="text-red-400 text-xs">{errors.timer}</p>
      )}
    </div>
  );
}
