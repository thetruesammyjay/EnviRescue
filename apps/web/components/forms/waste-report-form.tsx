"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconPlus,
  IconUpload,
  IconCheckCircle,
  IconMapPin,
  IconScale,
} from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

export function WasteReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "Plastic";
  const initialDescription = searchParams.get("description") ?? "";

  const [category, setCategory] = useState(initialCategory);
  const [quantity, setQuantity] = useState("2.5");
  const [location, setLocation] = useState("Engineering Hall B, Floor 2");
  const [description, setDescription] = useState(initialDescription);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage("Waste report successfully logged and verified!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }, 600);
  }

  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-8" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-pastel-green border border-emerald-200 p-4 text-emerald-950">
          <IconCheckCircle className="h-6 w-6 text-emerald-700 shrink-0" />
          <div>
            <p className="text-sm font-bold">{successMessage}</p>
            <p className="text-xs text-emerald-800">Redirecting to environmental dashboard...</p>
          </div>
        </div>
      )}

      {/* Category Picker with Huge Icons */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          1. Select Waste Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOCK_CATEGORIES.map((cat) => {
            const active = category.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-colors ${
                  active
                    ? "bg-pastel-yellow border-amber-400 text-amber-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 mb-2">
                  <CategoryIcon className="h-6 w-6" iconKey={cat.iconKey} />
                </div>
                <span className="text-xs font-semibold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Location Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <IconScale className="h-4 w-4 text-slate-400" />
            <span>2. Quantity (kg)</span>
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            min="0.01"
            name="quantity"
            required
            step="0.01"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <IconMapPin className="h-4 w-4 text-slate-400" />
            <span>3. Campus Location / Bin Station</span>
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            name="location"
            placeholder="e.g. Science Library, North Entrance"
            required
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          4. Description & Notes (Optional)
        </label>
        <textarea
          className="w-full min-h-[90px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
          name="description"
          placeholder="e.g. Clean sorted plastic bottles from engineering study lounge"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Optional Photo Upload */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          5. Photo Verification (Optional)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
            <IconUpload className="h-4 w-4 text-slate-500" />
            <span>Choose Image</span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              type="file"
              onChange={handleImageChange}
            />
          </label>
          {imagePreview && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <IconCheckCircle className="h-4 w-4" />
              <span>Image attached</span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          disabled={submitting}
          size="lg"
          type="submit"
          variant="yellow"
        >
          <IconPlus className="h-5 w-5" />
          <span>{submitting ? "Saving Report..." : "Submit Waste Report"}</span>
        </Button>
      </div>
    </form>
  );
}
