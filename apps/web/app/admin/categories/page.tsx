"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { IconPlus, IconCheck, IconRecycle } from "@/components/ui/icons";
import { MOCK_CATEGORIES, type CategoryItem } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Waste Categories Configuration</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain active waste categories, recyclable flags, and disposal guidelines.
          </p>
        </div>
        <Button size="sm" variant="yellow">
          <IconPlus className="h-4 w-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <div
            className={`rounded-2xl border p-4 flex flex-col justify-between ${cat.bgColor} ${cat.borderColor}`}
            key={cat.id}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900">
                  <CategoryIcon className="h-6 w-6" iconKey={cat.iconKey} />
                </div>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                    cat.recyclable
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.recyclable ? "Recyclable" : "Special Stream"}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200/60 flex justify-end">
              <Button size="sm" variant="ghost">
                <span>Edit</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
