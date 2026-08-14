import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-2 text-sm text-emerald-700">{helper}</p> : null}
    </Card>
  );
}
