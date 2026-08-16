import { Suspense } from "react";
import { WasteReportForm } from "@/components/forms/waste-report-form";
import { SectionPage } from "@/components/layout/section-page";

export default function NewWasteReportPage() {
  return (
    <SectionPage
      description="Record the waste category, quantity in kilograms, location on campus, and optional photo verification."
      title="Log Waste Item"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs font-light text-slate-400">Loading form...</div>}>
        <WasteReportForm />
      </Suspense>
    </SectionPage>
  );
}
