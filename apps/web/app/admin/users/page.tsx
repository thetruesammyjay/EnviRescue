"use client";

import { useState } from "react";
import { IconUser, IconShield, IconMapPin, IconLeaf } from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

interface PlatformUserItem {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  zone: string;
  ecoPoints: number;
  reportsCount: number;
}

const INITIAL_USERS: PlatformUserItem[] = [
  {
    id: "u-1",
    name: "Shalom EcoChampion",
    email: "shalom@envirescue.org",
    role: "user",
    zone: "Zone A - North Sector & Residential",
    ecoPoints: 480,
    reportsCount: 14,
  },
  {
    id: "u-2",
    name: "Dr. Evelyn Green",
    email: "admin@envirescue.org",
    role: "admin",
    zone: "All Operations Zones",
    ecoPoints: 1250,
    reportsCount: 42,
  },
  {
    id: "u-3",
    name: "David Chen",
    email: "dchen@envirescue.org",
    role: "user",
    zone: "Zone C - Industrial & Research Labs",
    ecoPoints: 310,
    reportsCount: 8,
  },
  {
    id: "u-4",
    name: "Amina Yusuf",
    email: "amina.y@envirescue.org",
    role: "user",
    zone: "Zone B - Central Plaza & Commercial",
    ecoPoints: 620,
    reportsCount: 22,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User & Contributor Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered contributors, assigned collection zones, and eco points tracking.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {users.map((u) => (
          <div
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            key={u.id}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-950 font-bold text-sm shrink-0">
                {u.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{u.name}</h3>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                      u.role === "admin"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {u.role === "admin" ? "Admin" : "Citizen"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{u.email}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <IconMapPin className="h-3 w-3 text-emerald-600" />
                    {u.zone}
                  </span>
                  <span>•</span>
                  <span>{u.reportsCount} Reports</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                {u.ecoPoints} pts
              </span>
              <Button size="sm" variant="outline">
                <span>Edit Role</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
