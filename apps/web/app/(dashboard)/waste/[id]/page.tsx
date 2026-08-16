import Link from "next/link";
import { SectionPage } from "@/components/layout/section-page";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  IconMapPin,
  IconScale,
  IconCheckCircle,
  IconRecycle,
  IconScan,
} from "@/components/ui/icons";
import { INITIAL_MOCK_REPORTS } from "@/lib/mock-data";
import { Button } from "@envirescue/ui";

export function generateStaticParams() {
  return INITIAL_MOCK_REPORTS.map((report) => ({
    id: report.id,
  }));
}

export default async function WasteReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = INITIAL_MOCK_REPORTS.find((r) => r.id === id) || INITIAL_MOCK_REPORTS[0];

  return (
    <SectionPage
      action={
        <Link href="/waste">
          <Button size="sm" variant="outline">
            <span>Back to Reports</span>
          </Button>
        </Link>
      }
      description={`Record identifier: ${report.id}`}
      title="Waste Log Details"
    >
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pastel-yellow border border-amber-300 text-amber-950">
              <CategoryIcon className="h-8 w-8" iconKey={report.iconKey} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{report.category} Waste Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recorded on {report.date}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <IconScale className="h-4 w-4 text-slate-400" />
                <span>Quantity</span>
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{report.quantityKg} kg</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <IconMapPin className="h-4 w-4 text-slate-400" />
                <span>Campus Location</span>
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">{report.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</h3>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-2xl p-4 border border-slate-200">
              {report.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pastel-green border border-emerald-200 flex items-center gap-3">
            <IconCheckCircle className="h-6 w-6 text-emerald-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">Status: Verified for Recycling Diversion</p>
              <p className="text-xs text-emerald-800">Assigned to campus green sorting stream.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link className="block w-full" href={`/recycling?category=${encodeURIComponent(report.category)}`}>
                <Button className="w-full" size="md" variant="yellow">
                  <IconRecycle className="h-4 w-4" />
                  <span>View Recycling Guide</span>
                </Button>
              </Link>
              <Link className="block w-full" href="/classify">
                <Button className="w-full" size="md" variant="outline">
                  <IconScan className="h-4 w-4" />
                  <span>Scan Another Item</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
