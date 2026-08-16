"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconScan,
  IconUpload,
  IconCheckCircle,
  IconAlertTriangle,
  IconPlus,
} from "@/components/ui/icons";
import { SAMPLE_CLASSIFY_ITEMS, type SampleClassifyItem } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export default function ClassifyPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(SAMPLE_CLASSIFY_ITEMS[0].imageUrl);
  const [result, setResult] = useState<SampleClassifyItem | null>(SAMPLE_CLASSIFY_ITEMS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runScanSimulation(file.name);
    }
  }

  function handlePickSample(sample: SampleClassifyItem) {
    setSelectedFile(null);
    setPreviewUrl(sample.imageUrl);
    setIsScanning(true);
    setTimeout(() => {
      setResult(sample);
      setIsScanning(false);
    }, 450);
  }

  function runScanSimulation(filename: string) {
    setIsScanning(true);
    setTimeout(() => {
      const lower = filename.toLowerCase();
      let match = SAMPLE_CLASSIFY_ITEMS[0];
      if (lower.includes("box") || lower.includes("cardboard") || lower.includes("paper")) match = SAMPLE_CLASSIFY_ITEMS[1];
      else if (lower.includes("can") || lower.includes("metal") || lower.includes("tin")) match = SAMPLE_CLASSIFY_ITEMS[2];
      else if (lower.includes("food") || lower.includes("apple") || lower.includes("fruit")) match = SAMPLE_CLASSIFY_ITEMS[3];
      else if (lower.includes("battery")) match = SAMPLE_CLASSIFY_ITEMS[4];
      else if (lower.includes("cup")) match = SAMPLE_CLASSIFY_ITEMS[5];
      setResult(match);
      setIsScanning(false);
    }, 600);
  }

  return (
    <SectionPage
      title="Classify Waste"
    >
      <div className="grid gap-6 lg:grid-cols-12">

        {/* ── Left: Upload + Sample Picker ── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Upload dropzone — clean scanner illustration */}
          <div
            className="rounded-[2rem] border-2 border-dashed border-slate-300 bg-white overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors flex flex-col sm:flex-row"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
            />
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <IconScan className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium text-slate-900">Upload Waste Photo</h3>
              <p className="text-xs font-light text-slate-500 leading-relaxed max-w-xs">
                Take a photo or upload an image. The AI model identifies the material and recycling rules.
              </p>
              <div>
                <Button size="sm" type="button" variant="primary">
                  <IconUpload className="h-3.5 w-3.5" />
                  <span>Select Image</span>
                </Button>
              </div>
            </div>
            {/* Beautiful fitted scan vector */}
            <div className="w-full sm:w-48 md:w-56 shrink-0 aspect-square sm:aspect-auto relative bg-emerald-50/40">
              <img
                alt="AI Waste Scanner"
                className="w-full h-full object-cover"
                src="/ai_scan.jpg"
              />
            </div>
          </div>

          {/* Sample picker — full image fit with no cutting */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 space-y-3">
            <p className="text-xs font-light uppercase tracking-wider text-slate-500">
              Or select a sample
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {SAMPLE_CLASSIFY_ITEMS.map((item) => {
                const active = result?.id === item.id && !selectedFile;
                return (
                  <button
                    className="flex flex-col group"
                    key={item.id}
                    type="button"
                    onClick={() => handlePickSample(item)}
                  >
                    <div
                      className={`w-full aspect-square rounded-2xl overflow-hidden border-2 p-1.5 bg-slate-50/70 flex items-center justify-center transition-all ${
                        active
                          ? "border-emerald-500 scale-[1.04] bg-white shadow-sm"
                          : "border-slate-200 group-hover:border-slate-300"
                      }`}
                    >
                      <img
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        src={item.imageUrl}
                      />
                    </div>
                    <span className={`mt-1.5 text-[11px] text-center leading-tight truncate w-full ${active ? "font-medium text-emerald-800" : "font-light text-slate-600"}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Classification Result ── */}
        <div className="lg:col-span-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-medium text-slate-900">Result</h3>
              {result && !isScanning && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {Math.round(result.confidence * 100)}% confidence
                </span>
              )}
            </div>

            {isScanning ? (
              <div className="p-12 text-center space-y-3 my-auto">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center animate-spin">
                  <IconScan className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-800">Classifying...</p>
                <p className="text-xs font-light text-slate-500">Running model inference</p>
              </div>
            ) : result ? (
              <div className="flex flex-col h-full">
                {/* Fitted preview image — complete bottle visible with no cropping */}
                <div className="relative w-full h-56 sm:h-64 bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                  <img
                    alt={result.name}
                    className="max-h-full max-w-full object-contain"
                    src={previewUrl ?? result.imageUrl}
                  />
                  {/* Category icon overlay */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 p-1 shadow-sm">
                    <CategoryIcon
                      alt={result.category}
                      className="w-full h-full object-contain"
                      iconKey={result.iconKey}
                    />
                  </div>
                </div>

                {/* Result details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <p className="text-[11px] font-light uppercase tracking-wider text-slate-400">
                      Detected Material
                    </p>
                    <h4 className="text-lg font-medium text-slate-900 mt-0.5">{result.detectedType}</h4>
                    <p className="text-xs font-light text-slate-500 mt-0.5">Category: {result.category}</p>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-4 rounded-2xl ${
                      result.recyclable ? "bg-emerald-50/70 border border-emerald-200/80" : "bg-rose-50/70 border border-rose-200/80"
                    }`}
                  >
                    {result.recyclable ? (
                      <IconCheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <IconAlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <p className="text-xs font-light text-slate-700 leading-relaxed">{result.instructions}</p>
                  </div>

                  <div className="mt-auto space-y-2 pt-2">
                    <Link
                      className="block"
                      href={`/waste/new?category=${encodeURIComponent(result.category)}&description=${encodeURIComponent(result.detectedType)}`}
                    >
                      <Button className="w-full" size="md" variant="primary">
                        <IconPlus className="h-4 w-4" />
                        <span>Submit Waste Report</span>
                      </Button>
                    </Link>
                    <Link
                      className="block"
                      href={`/recycling?category=${encodeURIComponent(result.category)}`}
                    >
                      <Button className="w-full" size="md" variant="outline">
                        <span>View Recycling Guidance</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs font-light text-slate-500">
                Select an item or upload an image to begin.
              </div>
            )}
          </div>
        </div>

      </div>
    </SectionPage>
  );
}
