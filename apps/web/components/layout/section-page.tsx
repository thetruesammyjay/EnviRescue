import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

export function SectionPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>
      {children ?? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
          This module is scaffolded and ready for implementation.
        </div>
      )}
    </AppShell>
  );
}
