import type { ButtonHTMLAttributes, ReactNode } from "react";


type Variant = "primary" | "secondary" | "danger" | "ghost" | "green";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-700 text-white border border-gray-600",

  // ⭐ New Green variant
  green: "bg-green-600 hover:bg-green-700 text-white",
};


const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-1 text-[10px]",
  md: "px-3 py-2",
  lg: "px-5 py-3 text-lg",
};

export default function Button({
  children,
  variant = "ghost",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        flex items-center justify-center gap-[9px] rounded cursor-pointer transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
