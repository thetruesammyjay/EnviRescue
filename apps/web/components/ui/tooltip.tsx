"use client";

import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ label, children, position = "bottom" }: TooltipProps) {
  const posStyles = {
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    top:    "bottom-full mb-2 left-1/2 -translate-x-1/2",
    left:   "right-full mr-2 top-1/2 -translate-y-1/2",
    right:  "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowStyles = {
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent",
    top:    "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent",
    left:   "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent",
    right:  "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent",
  };

  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className={`
          pointer-events-none absolute z-[200] whitespace-nowrap
          ${posStyles[position]}
          opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
          transition-all duration-150
        `}
      >
        {/* Arrow */}
        <span
          className={`absolute w-0 h-0 border-4 ${arrowStyles[position]}`}
          style={{ borderStyle: "solid" }}
        />
        {/* Label */}
        <span className="block bg-slate-800 text-white text-[11px] font-light px-2.5 py-1 rounded-lg shadow-md">
          {label}
        </span>
      </div>
    </div>
  );
}
