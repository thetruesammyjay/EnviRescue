"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconPlus,
  IconMapPin,
  IconSearch,
  IconCheckCircle,
  IconAlertTriangle,
} from "@/components/ui/icons";
import { INITIAL_MOCK_REPORTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function WasteReportsPage() {
  const [reports] = useState(INITIAL_MOCK_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = reports.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SectionPage
      action={
        <Link href="/waste/new">
          <Button size="sm" variant="yellow">
            <IconPlus className="h-4 w-4" />
            <span>New Report</span>
          </Button>
        </Link>
      }
      description="View and manage all verified waste logs across collection stations."
      title="Waste Reports"
    >
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="relative w-full sm:w-80">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="Filter by description, location..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter Pills with SVG icons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              className={`rounded-2xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {MOCK_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                className={`flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <CategoryIcon className="h-3.5 w-3.5" iconKey={cat.iconKey} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => (
            <div
              className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 flex flex-col justify-between"
              key={report.id}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Full-bleed image */}
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                      <CategoryIcon
                        alt={report.category}
                        className="absolute inset-0 w-full h-full object-cover"
                        iconKey={report.iconKey}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">{report.category}</h3>
                      <p className="text-xs font-light text-slate-400">{report.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{report.quantityKg} kg</span>
                </div>

                <p className="text-xs font-light text-slate-600 line-clamp-3">{report.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500 truncate max-w-[180px]">
                  <IconMapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{report.location}</span>
                </div>
                <Link href={`/waste/${report.id}`}>
                  <Button size="sm" variant="ghost">
                    <span>Details</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionPage>
  );
}
