"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconScan,
  IconArrowRight,
  IconPlus,
  IconMapPin,
  IconCheckCircle,
} from "@/components/ui/icons";
import { MOCK_CATEGORIES, SAMPLE_CLASSIFY_ITEMS, INITIAL_MOCK_REPORTS } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function HomePage() {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_CLASSIFY_ITEMS[0]);

  return (
    <AppShell>
      <div className="space-y-8">

        {/* ── Hero ── */}
        <section className="rounded-3xl bg-[#e0f8ee] border border-emerald-200 overflow-hidden flex flex-col-reverse sm:flex-row items-center justify-between p-5 sm:p-7 gap-6">
          <div className="flex-1 flex flex-col justify-center space-y-3 w-full">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
              AI-Powered Waste Management
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Classify. Recycle.<br className="hidden sm:inline" /> Track impact.
            </h1>
            <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed max-w-sm">
              AI-assisted waste classification, recycling guidance, and collection tracking.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Link href="/classify">
                <Button size="sm" variant="primary">
                  <span>Classify Waste</span>
                </Button>
              </Link>
              <Link href="/recycling">
                <Button size="sm" variant="outline">
                  <span>Recycling Guide</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero image — fully contained and nicely rounded on mobile & desktop */}
          <div className="w-full sm:w-64 md:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden shadow-xs relative shrink-0 border border-emerald-300/40 bg-white">
            <img
              alt="Waste sorting"
              className="w-full h-full object-cover object-center"
              src="/hero.jpg"
            />
          </div>
        </section>

        {/* ── Waste Categories ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-slate-900">Waste Categories</h2>
              <p className="text-xs font-light text-slate-500">Select a category for recycling guidance</p>
            </div>
            <Link className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800" href="/recycling">
              <span>View all</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Category tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {MOCK_CATEGORIES.map((category) => (
              <Link
                className="group flex flex-col"
                href={`/recycling?category=${encodeURIComponent(category.name)}`}
                key={category.id}
              >
                <div
                  className={`relative w-full aspect-square rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-slate-200/60 transition-transform duration-150 group-hover:scale-[1.02] flex items-center justify-center p-3 sm:p-4 ${category.bgColor}`}
                >
                  <img
                    alt={category.name}
                    className="max-h-full max-w-full object-contain"
                    src={VECTOR_MAP[category.iconKey]}
                  />
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-slate-800 text-center truncate">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── AI Classification Feature Card (Clean & Focused) ── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Action summary */}
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100">
                <IconScan className="h-3 w-3" />
                <span>AI Vision Classifier</span>
              </div>
              <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                Scan & identify waste in seconds
              </h2>
              <p className="text-xs sm:text-sm font-light text-slate-600 leading-relaxed">
                Take a photo or upload an image to detect recyclable materials, correct sorting bin, and proper disposal instructions.
              </p>
              <div className="pt-1">
                <Link href="/classify">
                  <Button size="sm" variant="primary">
                    <IconScan className="h-3.5 w-3.5" />
                    <span>Open AI Scanner</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Live Interactive Sample Card */}
            <div className="w-full md:w-80 rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <p className="text-[11px] font-light uppercase tracking-wider text-slate-500">
                Try with a sample item:
              </p>

              {/* Sample item buttons */}
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_CLASSIFY_ITEMS.slice(0, 4).map((item) => {
                  const active = selectedSample.id === item.id;
                  return (
                    <button
                      className={`relative aspect-square rounded-xl p-1 border transition-all flex items-center justify-center ${
                        active
                          ? "border-emerald-500 bg-white shadow-sm scale-105"
                          : "border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSample(item)}
                    >
                      <img
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        src={item.imageUrl}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Result Preview Box */}
              <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {selectedSample.detectedType}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {Math.round(selectedSample.confidence * 100)}%
                  </span>
                </div>
                <p className="text-[11px] font-light text-slate-500 leading-normal">
                  {selectedSample.instructions}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-light">
                    Category: {selectedSample.category}
                  </span>
                  <Link
                    className="text-[11px] font-medium text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                    href={`/waste/new?category=${encodeURIComponent(selectedSample.category)}`}
                  >
                    <span>Report</span>
                    <IconArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Recent Reports ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-medium text-slate-900">Recent Waste Reports</h2>
            <Link className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800" href="/waste">
              <span>View all</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INITIAL_MOCK_REPORTS.slice(0, 3).map((rep) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center p-3 gap-3"
                key={rep.id}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <CategoryIcon
                    alt={rep.category}
                    className="absolute inset-0 w-full h-full object-cover"
                    iconKey={rep.iconKey}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900 truncate">{rep.category}</h3>
                  <p className="text-xs font-light text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <IconMapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{rep.location}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-medium text-slate-800">{rep.quantityKg} kg</span>
                  <p className="text-[10px] font-light text-slate-400">{rep.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  );
}

const VECTOR_MAP: Record<string, string> = {
  plastic: "/vectors/plastic.png",
  paper: "/vectors/paper.png",
  glass: "/vectors/glassa.png",
  metal: "/vectors/metal.png",
  organic: "/vectors/organic.png",
  electronic: "/vectors/electronics.png",
  battery: "/vectors/harzardous.png",
  general: "/vectors/general.png",
};
