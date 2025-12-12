import type { ReactNode } from "react";

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  value: string;
  error?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export default function SelectField({
  label,
  required,
  value,
  error,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
