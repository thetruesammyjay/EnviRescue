"use client";

import { useState } from "react";
import { SectionPage } from "@/components/layout/section-page";
import {
  IconUser,
  IconMapPin,
  IconCheckCircle,
} from "@/components/ui/icons";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import { Button } from "@envirescue/ui";

export default function SettingsPage() {
  const user = getCurrentUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [zone, setZone] = useState(user.zone);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setCurrentUser({
      ...user,
      fullName,
      email,
      zone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <SectionPage
      description="Manage your profile settings and default campus collection zone."
      title="User Settings"
    >
      <form
        className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6"
        onSubmit={handleSave}
      >
        {saved && (
          <div className="flex items-center gap-2 rounded-2xl bg-pastel-green border border-emerald-200 p-4 text-xs font-bold text-emerald-950">
            <IconCheckCircle className="h-5 w-5 text-emerald-700 shrink-0" />
            <span>Profile and collection zone preferences saved successfully.</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <IconUser className="h-4 w-4 text-slate-400" />
            <span>Full Name</span>
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <IconMapPin className="h-4 w-4 text-slate-400" />
            <span>Default Campus Collection Zone</span>
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            <option value="Zone A - North Campus & Dorms">Zone A - North Campus & Dorms</option>
            <option value="Zone B - Student Center & Dining">Zone B - Student Center & Dining</option>
            <option value="Zone C - Science & Labs">Zone C - Science & Labs</option>
            <option value="Zone D - Administration & Library">Zone D - Administration & Library</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button size="md" type="submit" variant="yellow">
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </SectionPage>
  );
}
