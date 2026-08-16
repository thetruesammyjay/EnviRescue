"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  IconShield,
  IconScan,
  IconUser,
  IconLayers,
  IconChart,
} from "@/components/ui/icons";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const adminNav = [
    { href: "/admin/dashboard", label: "Admin Overview", icon: <IconChart className="h-4 w-4" /> },
    { href: "/admin/classifications", label: "AI Review Queue", icon: <IconScan className="h-4 w-4" /> },
    { href: "/admin/users", label: "Users & Roles", icon: <IconUser className="h-4 w-4" /> },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Admin Navigation Bar */}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <IconShield className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Admin Center
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {adminNav.map((item) => (
              <Link
                className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>{children}</div>
      </div>
    </AppShell>
  );
}
