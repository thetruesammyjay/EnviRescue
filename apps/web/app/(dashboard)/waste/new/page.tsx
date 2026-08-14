import { WasteReportForm } from "@/components/forms/waste-report-form";
import { SectionPage } from "@/components/layout/section-page";

export default function NewWasteReportPage() {
  return <SectionPage title="Report waste" description="Record the type, quantity, location, description, and optional image of generated waste."><WasteReportForm /></SectionPage>;
}
