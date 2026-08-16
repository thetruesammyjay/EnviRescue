"use client";

import { useState } from "react";
import { IconTruck, IconMapPin, IconCalendar, IconPlus } from "@/components/ui/icons";
import { MOCK_COLLECTIONS } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function AdminCollectionsPage() {
  const [schedules] = useState(MOCK_COLLECTIONS);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Collection Schedules & Fleet Dispatch</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campus collection frequency and driver routing.
          </p>
        </div>
        <Button size="sm" variant="yellow">
          <IconPlus className="h-4 w-4" />
          <span>New Schedule</span>
        </Button>
      </div>

      <div className="divide-y divide-slate-100">
        {schedules.map((item) => (
          <div
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            key={item.id}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{item.zone}</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {item.driverStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <IconMapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{item.campusArea}</span>
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Next Pickup:</span> {item.nextDate} ({item.timeWindow})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <span>Edit Schedule</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
