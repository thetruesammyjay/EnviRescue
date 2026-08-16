import { WasteReportForm } from "@/components/forms/waste-report-form";
import { SectionPage } from "@/components/layout/section-page";

export default function NewWasteReportPage() {
  return (
    <SectionPage
      description="Record the waste category, quantity in kilograms, location on campus, and optional photo verification."
      title="Log Waste Item"
    >
      <WasteReportForm />
    </SectionPage>
  );
}
