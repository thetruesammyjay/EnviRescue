"use client";

import { useState } from "react";
import { SectionPage } from "@/components/layout/section-page";
import {
  IconCalendar,
  IconMapPin,
  IconTruck,
} from "@/components/ui/icons";
import { MOCK_COLLECTIONS } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function CollectionsPage() {
  const [selectedZone, setSelectedZone] = useState("All");

  const filtered = MOCK_COLLECTIONS.filter(
    (c) => selectedZone === "All" || c.zone.includes(selectedZone),
  );

  return (
    <SectionPage
      description="View upcoming collection dates and schedules for your collection zone."
      title="Collection Schedules"
    >
      <div className="space-y-6">
        {/* Visual Banner */}
        <div className="rounded-3xl bg-pastel-green border border-emerald-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Collection Logistics</h2>
            <p className="text-xs sm:text-sm font-light text-slate-700 max-w-md leading-relaxed">
              Locate active collection routes, scheduled pickup times, and specialized collection runs.
            </p>
          </div>
          <div className="shrink-0">
            <img
              alt="Collection Logistics"
              className="w-40 sm:w-48 h-auto object-contain"
              src="/assets/undraw_online-community_3o0l.svg"
            />
          </div>
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar rounded-3xl border border-slate-200 bg-white p-3">
          <button
            className={`rounded-2xl px-4 py-2 text-xs transition-colors ${
              selectedZone === "All"
                ? "bg-slate-900 text-white font-medium"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 font-light"
            }`}
            onClick={() => setSelectedZone("All")}
          >
            All Zones
          </button>
          {MOCK_COLLECTIONS.map((c) => (
            <button
              className={`rounded-2xl px-4 py-2 text-xs whitespace-nowrap transition-colors ${
                selectedZone === c.zone
                  ? "bg-emerald-600 text-white font-medium"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 font-light"
              }`}
              key={c.id}
              onClick={() => setSelectedZone(c.zone)}
            >
              {c.zone.split(" - ")[0]}
            </button>
          ))}
        </div>

        {/* Schedules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <div
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between"
              key={item.id}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.zone}</h3>
                    <p className="text-xs font-light text-slate-500 mt-0.5 flex items-center gap-1">
                      <IconMapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{item.campusArea}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Status: {item.driverStatus}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <IconCalendar className="h-4 w-4 text-slate-400" />
                      <span>Next Pickup</span>
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{item.nextDate}</p>
                    <p className="text-xs font-light text-slate-500 mt-0.5">{item.timeWindow}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <IconTruck className="h-4 w-4 text-slate-400" />
                      <span>Routine Days</span>
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{item.dayOfWeek}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Accepted Streams:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.wasteTypes.map((type) => (
                      <span
                        className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-light text-slate-800"
                        key={type}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-light text-slate-400">Waste Management Dispatch</span>
                <Button size="sm" variant="outline">
                  <span>Subscribe Alerts</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionPage>
  );
}
