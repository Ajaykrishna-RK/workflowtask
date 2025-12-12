
interface InputFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string | number;
  type?: "text" | "number" | "textarea";
  placeholder?: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
}

export default function InputField({
  label,
  required,
  error,
  value,
  type = "text",
  placeholder,
  min,
  max,
  onChange,
}: InputFieldProps) {
  const baseClasses =
    "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} min-h-[100px]`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        />
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
