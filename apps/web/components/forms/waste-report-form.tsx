"use client";

import { WASTE_CATEGORIES } from "@/lib/constants";
import { Button } from "@envirescue/ui";
import { useState, type FormEvent } from "react";

export function WasteReportForm() {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("The report form is ready to connect to POST /api/v1/waste.");
  }

  return (
    <form className="grid gap-5 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-2" onSubmit={submit}>
      <label className="text-sm font-medium">
        Category
        <select className="mt-1 w-full rounded-md border px-3 py-2" name="category" required>
          <option value="">Select a category</option>
          {WASTE_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Quantity (kg)
        <input className="mt-1 w-full rounded-md border px-3 py-2" min="0.01" name="quantity" required step="0.01" type="number" />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Location
        <input className="mt-1 w-full rounded-md border px-3 py-2" name="location" required />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Description
        <textarea className="mt-1 min-h-28 w-full rounded-md border px-3 py-2" name="description" />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Waste image (optional)
        <input accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" name="image" type="file" />
      </label>
      <div className="md:col-span-2">
        <Button type="submit">Save waste report</Button>
        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      </div>
    </form>
  );
}
