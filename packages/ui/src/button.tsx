import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "yellow" | "dark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-3.5 py-2 text-xs sm:text-sm rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base rounded-2xl gap-2",
  };

  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    yellow:  "bg-emerald-600 text-white hover:bg-emerald-700",
    dark:    "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    ghost:   "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:  "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
