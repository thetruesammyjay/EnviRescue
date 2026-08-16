"use client";

import { useState } from "react";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryChart } from "@/components/charts/category-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  IconScale,
  IconRecycle,
  IconLeaf,
  IconCalendar,
  IconChart,
} from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <SectionPage
      action={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <span>Export CSV</span>
          </Button>
        </div>
      }
      description="Summarize waste generation, recycling diversion metrics, and carbon emissions saved."
      title="Environmental Impact Analytics"
    >
      <div className="space-y-6">
        {/* Visual Banner */}
        <div className="rounded-3xl bg-pastel-yellow border border-amber-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Verified Environmental Savings</h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-md">
              Real-time calculations of kilograms sorted, landfill diversion rates, and greenhouse gas offsets.
            </p>
          </div>
          <div className="shrink-0">
            <img
              alt="Analytics"
              className="w-40 sm:w-48 h-auto object-contain"
              src="/assets/undraw_revenue_kv38.svg"
            />
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white p-3">
          <span className="text-xs font-semibold text-slate-500 pl-2">Time Range:</span>
          {["7d", "30d", "90d", "Year-to-date"].map((range) => (
            <button
              className={`rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                timeRange === range
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              key={range}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Impact Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            helper="All active waste streams"
            icon={<IconScale className="h-7 w-7 text-amber-700" />}
            label="Total Waste Diverted"
            trend="+18% vs baseline"
            value="342.8 kg"
            variant="yellow"
          />
          <MetricCard
            helper="Calculated via EPA WARM model"
            icon={<IconLeaf className="h-7 w-7 text-emerald-700" />}
            label="Estimated CO2 Avoided"
            value="489.2 kg"
            variant="green"
          />
          <MetricCard
            helper="Recycled or composted"
            icon={<IconRecycle className="h-7 w-7 text-sky-700" />}
            label="Diversion Rate"
            trend="+6.2% target"
            value="84.2%"
            variant="blue"
          />
          <MetricCard
            helper="142 active contributors"
            icon={<IconChart className="h-7 w-7 text-orange-700" />}
            label="Total Log Events"
            value="142"
            variant="peach"
          />
        </div>

        {/* Detailed Material Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Material Breakdown</h2>
          <p className="text-xs text-slate-500">Distribution of waste fractions collected over the selected period</p>
          <CategoryChart />
        </div>
      </div>
    </SectionPage>
  );
}
