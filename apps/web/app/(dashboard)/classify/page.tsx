import { SectionPage } from "@/components/layout/section-page";

export default function ClassifyPage() {
  return (
    <SectionPage title="Classify waste" description="Upload an image to receive an AI-assisted category and confidence score.">
      <div className="rounded-xl border border-dashed bg-white p-10 text-center">
        <input accept="image/jpeg,image/png,image/webp" aria-label="Waste image" type="file" />
        <p className="mt-4 text-sm text-slate-500">Maximum 5 MB. JPEG, PNG, or WebP.</p>
      </div>
    </SectionPage>
  );
}
