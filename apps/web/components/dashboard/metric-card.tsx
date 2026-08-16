import type { ReactNode } from "react";

export interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  trend?: string;
  variant?: "yellow" | "green" | "blue" | "peach" | "white";
}

export function MetricCard({ label, value, helper, trend, variant = "white" }: MetricCardProps) {
  const bg: Record<string, string> = {
    white:  "bg-white border-slate-200",
    yellow: "bg-pastel-yellow border-amber-100",
    green:  "bg-pastel-green border-emerald-100",
    blue:   "bg-pastel-blue border-sky-100",
    peach:  "bg-pastel-peach border-orange-100",
  };

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${bg[variant]}`}>
      <p className="text-[11px] font-light uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-2xl font-medium text-slate-900 tracking-tight">{value}</p>
      <div className="flex items-center justify-between text-[11px] font-light text-slate-500">
        {helper && <span>{helper}</span>}
        {trend && <span className="text-emerald-700">{trend}</span>}
      </div>
    </div>
  );
}
