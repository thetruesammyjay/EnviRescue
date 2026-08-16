"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconPlus, IconCheckCircle, IconAlertTriangle } from "@/components/ui/icons";
import { MOCK_RECYCLING_TIPS } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function AdminRecyclingTipsPage() {
  const [tips] = useState(MOCK_RECYCLING_TIPS);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recycling Rules & Guidelines Manager</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edit step-by-step preparation instructions and sorting rules shown to users.
          </p>
        </div>
        <Button size="sm" variant="yellow">
          <IconPlus className="h-4 w-4" />
          <span>Add New Guide</span>
        </Button>
      </div>

      <div className="divide-y divide-slate-100">
        {tips.map((tip) => (
          <div
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            key={tip.id}
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pastel-yellow border border-amber-300 text-amber-950 shrink-0">
                <CategoryIcon className="h-6 w-6" iconKey={tip.iconKey} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {tip.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{tip.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tip.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <span>Edit Guide</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
