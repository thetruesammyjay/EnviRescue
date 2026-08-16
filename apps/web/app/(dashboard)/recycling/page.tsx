"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconSearch,
  IconCheckCircle,
  IconAlertTriangle,
} from "@/components/ui/icons";
import { MOCK_CATEGORIES, MOCK_RECYCLING_TIPS } from "@/lib/mock-data";

function RecyclingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const initialQuery = searchParams.get("q") ?? "";

  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  const filteredTips = MOCK_RECYCLING_TIPS.filter((tip) => {
    const matchCat =
      selectedCat === "All" ||
      tip.category.toLowerCase().includes(selectedCat.toLowerCase()) ||
      selectedCat.toLowerCase().includes(tip.category.toLowerCase());
    const matchQuery =
      tip.title.toLowerCase().includes(query.toLowerCase()) ||
      tip.summary.toLowerCase().includes(query.toLowerCase()) ||
      tip.dos.some((d) => d.toLowerCase().includes(query.toLowerCase())) ||
      tip.donts.some((d) => d.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="relative w-full max-w-lg">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="Search by material, item name (e.g. coffee cup, pizza box)..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Category Picker matching reference layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 pt-2">
          <div
            className="flex flex-col cursor-pointer group"
            onClick={() => setSelectedCat("All")}
          >
            <div
              className={`w-full aspect-square rounded-3xl bg-[#e0f8ee] flex items-center justify-center p-4 transition-transform group-hover:scale-[1.02] ${
                selectedCat === "All" ? "border-2 border-emerald-600" : "border border-slate-200"
              }`}
            >
              <img
                alt="All Rules"
                className="w-full h-full object-contain"
                src="/assets/undraw_around-the-world_vgcy.svg"
              />
            </div>
            <p
              className={`mt-2 text-xs text-center truncate ${
                selectedCat === "All" ? "text-emerald-700 font-bold" : "text-slate-700 font-medium"
              }`}
            >
              All
            </p>
          </div>

          {MOCK_CATEGORIES.map((cat) => {
            const active = selectedCat.toLowerCase() === cat.name.toLowerCase();
            return (
              <div
                className="flex flex-col cursor-pointer group"
                key={cat.id}
                onClick={() => setSelectedCat(cat.name)}
              >
                <div
                  className={`w-full aspect-square rounded-3xl flex items-center justify-center p-4 transition-transform group-hover:scale-[1.02] ${cat.bgColor} ${
                    active ? "border-2 border-emerald-600" : "border border-slate-200"
                  }`}
                >
                  <CategoryIcon
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    iconKey={cat.iconKey}
                  />
                </div>
                <p
                  className={`mt-2 text-xs text-center truncate ${
                    active ? "text-emerald-700 font-bold" : "text-slate-700 font-medium"
                  }`}
                >
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredTips.map((tip) => (
          <div
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between"
            key={tip.id}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* Full-bleed icon image */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <CategoryIcon
                    alt={tip.category}
                    className="absolute inset-0 w-full h-full object-cover"
                    iconKey={tip.iconKey}
                  />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    {tip.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{tip.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{tip.summary}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Preparation Steps
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {tip.steps.map((step, idx) => (
                    <li className="flex items-start gap-2" key={idx}>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dos & Don'ts */}
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Dos */}
                <div className="p-3 rounded-2xl bg-pastel-green border border-emerald-200 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <IconCheckCircle className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Acceptable</span>
                  </h5>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {tip.dos.map((item, idx) => (
                      <li className="flex items-center gap-1.5" key={idx}>
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="p-3 rounded-2xl bg-pastel-pink border border-pink-200 space-y-2">
                  <h5 className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                    <IconAlertTriangle className="h-4 w-4 text-rose-700 shrink-0" />
                    <span>Do Not Include</span>
                  </h5>
                  <ul className="space-y-1 text-xs text-pink-900">
                    {tip.donts.map((item, idx) => (
                      <li className="flex items-center gap-1.5" key={idx}>
                        <span className="text-rose-700 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecyclingPage() {
  return (
    <SectionPage
      description="Browse explainable recycling rules, material preparation steps, and disposal guidelines."
      title="Campus Recycling Rules"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs font-light text-slate-400">Loading recycling guidelines...</div>}>
        <RecyclingContent />
      </Suspense>
    </SectionPage>
  );
}
