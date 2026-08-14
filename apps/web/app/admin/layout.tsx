import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell><div className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-700">Administrator</div>{children}</AppShell>;
}
