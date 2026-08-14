import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  ["/dashboard", "Dashboard"],
  ["/waste/new", "Report waste"],
  ["/classify", "Classify"],
  ["/recycling", "Recycling tips"],
  ["/collections", "Collections"],
  ["/reports", "Reports"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link className="text-xl font-bold text-emerald-800" href="/">
            EnviRescue
          </Link>
          <nav className="hidden gap-5 text-sm font-medium text-slate-600 md:flex">
            {navigation.map(([href, label]) => (
              <Link className="hover:text-emerald-700" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
