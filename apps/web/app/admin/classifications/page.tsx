"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconScan,
  IconCheck,
  IconAlertTriangle,
  IconCheckCircle,
} from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

interface FullReviewItem {
  id: string;
  category: string;
  iconKey: "plastic" | "metal" | "organic" | "battery" | "paper" | "electronic";
  imageLabel: string;
  confidence: number;
  reporter: string;
  zone: string;
  date: string;
}

const ALL_REVIEWS: FullReviewItem[] = [
  {
    id: "rev-201",
    category: "Plastic",
    iconKey: "plastic",
    imageLabel: "Opaque detergent bottle with plastic handle",
    confidence: 0.68,
    reporter: "student@campus.edu",
    zone: "Zone A - North Campus & Dorms",
    date: "10 mins ago",
  },
  {
    id: "rev-202",
    category: "Metal & Cans",
    iconKey: "metal",
    imageLabel: "Crushed metallic canister",
    confidence: 0.71,
    reporter: "labtech@campus.edu",
    zone: "Zone C - Science & Labs",
    date: "25 mins ago",
  },
  {
    id: "rev-203",
    category: "Hazardous & Batteries",
    iconKey: "battery",
    imageLabel: "Swollen power pack cell",
    confidence: 0.64,
    reporter: "itstaff@campus.edu",
    zone: "Zone C - Science & Labs",
    date: "1 hour ago",
  },
  {
    id: "rev-204",
    category: "Paper & Cardboard",
    iconKey: "paper",
    imageLabel: "Waxed food packaging carton",
    confidence: 0.74,
    reporter: "dining@campus.edu",
    zone: "Zone B - Student Center & Dining",
    date: "2 hours ago",
  },
];

export default function AdminClassificationsPage() {
  const [items, setItems] = useState(ALL_REVIEWS);

  function resolveItem(id: string) {
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">AI Classification Review Queue</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review predictions below the 80% confidence threshold to maintain data integrity.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">
          <IconCheckCircle className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
          <p className="font-bold text-slate-800 text-sm">All reviews resolved</p>
          <p>The AI classification model is running smoothly.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div
              className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              key={item.id}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-yellow border border-amber-300 text-amber-950 shrink-0">
                  <CategoryIcon className="h-7 w-7" iconKey={item.iconKey} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.imageLabel}</h3>
                    <span className="text-xs font-bold text-amber-900 bg-pastel-yellow px-2 py-0.5 rounded-lg border border-amber-200">
                      {Math.round(item.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    AI Suggestion: <span className="font-bold text-emerald-700">{item.category}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.zone} • Reported by {item.reporter} • {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <Button size="sm" variant="primary" onClick={() => resolveItem(item.id)}>
                  <IconCheck className="h-4 w-4" />
                  <span>Approve AI</span>
                </Button>
                <Button size="sm" variant="outline" onClick={() => resolveItem(item.id)}>
                  <span>Reassign Category</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
