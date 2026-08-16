"use client";

import Link from "next/link";
import { CategoryChart } from "@/components/charts/category-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconScan,
  IconPlus,
  IconMapPin,
  IconArrowRight,
} from "@/components/ui/icons";
import { INITIAL_MOCK_REPORTS } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@envirescue/ui";

export default function DashboardPage() {
  const user = getCurrentUser();

  return (
    <SectionPage
      action={
        <div className="flex items-center gap-2">
          <Link href="/classify">
            <Button size="sm" variant="yellow">
              <IconScan className="h-3.5 w-3.5" />
              <span>Classify</span>
            </Button>
          </Link>
          <Link href="/waste/new">
            <Button size="sm" variant="primary">
              <IconPlus className="h-3.5 w-3.5" />
              <span>Report</span>
            </Button>
          </Link>
        </div>
      }
      title="Dashboard"
    >
      <div className="space-y-5">

        {/* Metric Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Logged" value="121.6 kg" helper="48.5 kg this month" trend="+12%" variant="yellow" />
          <MetricCard label="Recyclable" value="84.2%" helper="Above 75% target" trend="+5%" variant="green" />
          <MetricCard label="Eco Points" value={`${user.ecoPoints}`} helper="Rank #3 zone" variant="blue" />
          <MetricCard label="Reports" value="28" helper="5 this week" variant="peach" />
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">Waste Breakdown</p>
            <Link className="text-xs font-light text-emerald-700 flex items-center gap-1" href="/reports">
              <span>Full report</span>
              <IconArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CategoryChart />
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">Recent Reports</p>
            <Link href="/waste/new">
              <Button size="sm" variant="outline">
                <IconPlus className="h-3.5 w-3.5" />
                <span>New</span>
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {INITIAL_MOCK_REPORTS.map((report) => (
              <div className="flex items-center gap-3 px-5 py-3.5" key={report.id}>
                {/* Full-bleed category image */}
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <CategoryIcon
                    alt={report.category}
                    className="absolute inset-0 w-full h-full object-cover"
                    iconKey={report.iconKey}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{report.category}</p>
                  <p className="text-xs font-light text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                    <IconMapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-slate-800">{report.quantityKg} kg</p>
                  <p className="text-[11px] font-light text-slate-400">{report.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SectionPage>
  );
}
