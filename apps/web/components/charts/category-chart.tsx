const exampleData = [
  ["Plastic", 40],
  ["Organic", 30],
  ["Paper", 20],
  ["Other", 10],
] as const;

export function CategoryChart() {
  return (
    <div aria-label="Example waste by category chart" className="space-y-4">
      {exampleData.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <div className="h-2 rounded bg-slate-100">
            <div className="h-2 rounded bg-emerald-600" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
