import type { ReactNode } from "react";

export function SectionPage({
  title,
  action,
  children,
}: {
  title: string;
  description?: string; // kept for compat but not rendered
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-slate-900">{title}</h1>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
