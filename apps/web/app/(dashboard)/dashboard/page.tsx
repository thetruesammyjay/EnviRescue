import { CategoryChart } from "@/components/charts/category-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionPage } from "@/components/layout/section-page";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <SectionPage title="Dashboard" description="A summary of your waste reporting and recycling activity.">
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Waste recorded" value="0 kg" helper="No reports yet" />
        <MetricCard label="Recyclable share" value="0%" helper="Add a report to begin" />
        <MetricCard label="Reports" value="0" helper="This month" />
      </div>
      <Card className="mt-6">
        <h2 className="mb-5 text-lg font-semibold">Waste by category</h2>
        <CategoryChart />
        <p className="mt-5 text-xs text-slate-500">Example visualization until live dashboard data is connected.</p>
      </Card>
    </SectionPage>
  );
}
