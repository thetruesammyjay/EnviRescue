import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: "default" | "pastel-yellow" | "pastel-green" | "pastel-blue" | "pastel-peach" | "pastel-pink";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200/80 text-slate-900",
    "pastel-yellow": "bg-pastel-yellow border-amber-200/80 text-amber-950",
    "pastel-green": "bg-pastel-green border-emerald-200/80 text-emerald-950",
    "pastel-blue": "bg-pastel-blue border-sky-200/80 text-sky-950",
    "pastel-peach": "bg-pastel-peach border-orange-200/80 text-orange-950",
    "pastel-pink": "bg-pastel-pink border-pink-200/80 text-pink-950",
  };

  return (
    <div
      className={`rounded-3xl border p-6 transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
