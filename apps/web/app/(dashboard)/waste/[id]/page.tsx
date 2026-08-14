import { SectionPage } from "@/components/layout/section-page";

export default async function WasteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SectionPage title="Waste report" description={`Waste report ${id}. The API response will populate this page.`} />;
}
