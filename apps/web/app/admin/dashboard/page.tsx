"use client";

import { useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconScan,
  IconCheckCircle,
  IconAlertTriangle,
  IconUser,
  IconShield,
  IconScale,
  IconCheck,
} from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

interface ReviewItem {
  id: string;
  category: string;
  iconKey: "plastic" | "metal" | "organic" | "battery";
  imageLabel: string;
  confidence: number;
  reporter: string;
  date: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-201",
    category: "Plastic",
    iconKey: "plastic",
    imageLabel: "Unclear container with label",
    confidence: 0.68,
    reporter: "user@envirescue.org",
    date: "10 mins ago",
  },
  {
    id: "rev-202",
    category: "Metal & Cans",
    iconKey: "metal",
    imageLabel: "Crushed metallic canister",
    confidence: 0.71,
    reporter: "ops@envirescue.org",
    date: "25 mins ago",
  },
  {
    id: "rev-203",
    category: "Hazardous & Batteries",
    iconKey: "battery",
    imageLabel: "Swollen power pack cell",
    confidence: 0.64,
    reporter: "support@envirescue.org",
    date: "1 hour ago",
  },
];

export default function AdminDashboardPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  function handleAction(id: string) {
    setReviews(reviews.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Admin Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          helper="Requires administrator sign-off"
          icon={<IconAlertTriangle className="h-7 w-7 text-amber-700" />}
          label="Pending AI Reviews"
          value={`${reviews.length}`}
          variant="yellow"
        />
        <MetricCard
          helper="99.8% uptime across models"
          icon={<IconScan className="h-7 w-7 text-emerald-700" />}
          label="AI Inference Accuracy"
          value="96.4%"
          variant="green"
        />
        <MetricCard
          helper="Across 4 active zones"
          icon={<IconUser className="h-7 w-7 text-sky-700" />}
          label="Active Platform Users"
          value="184"
          variant="blue"
        />
        <MetricCard
          helper="Total verified diversion"
          icon={<IconScale className="h-7 w-7 text-orange-700" />}
          label="Total Diverted Waste"
          value="1,420 kg"
          variant="peach"
        />
      </div>

      {/* AI Classification Review Queue */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Classification Review Queue</h2>
            <p className="text-xs text-slate-500">
              Low-confidence model classifications flagged for human administrator verification
            </p>
          </div>
          <Link href="/admin/classifications">
            <Button size="sm" variant="outline">
              <span>View All</span>
            </Button>
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <IconCheckCircle className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
            <span>All AI classifications have been verified. Review queue is clean!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((item) => (
              <div
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                key={item.id}
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pastel-yellow border border-amber-300 text-amber-950 shrink-0">
                    <CategoryIcon className="h-6 w-6" iconKey={item.iconKey} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.imageLabel}</h3>
                      <span className="text-xs font-bold text-amber-900 bg-pastel-yellow px-2 py-0.5 rounded-lg border border-amber-200">
                        {Math.round(item.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Suggested Category: <span className="font-semibold text-slate-800">{item.category}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Reported by {item.reporter} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAction(item.id)}
                  >
                    <IconCheck className="h-4 w-4" />
                    <span>Approve</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(item.id)}
                  >
                    <span>Reclassify</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
