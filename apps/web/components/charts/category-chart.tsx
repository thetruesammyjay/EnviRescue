"use client";

const distributionData = [
  { name: "Plastic",          iconKey: "plastic",    kg: 42.5, pct: 35, color: "#f59e0b", bg: "bg-pastel-yellow" },
  { name: "Paper & Cardboard",iconKey: "paper",      kg: 34.0, pct: 28, color: "#059669", bg: "bg-pastel-green"  },
  { name: "Organic & Compost",iconKey: "organic",    kg: 24.3, pct: 20, color: "#16a34a", bg: "bg-pastel-mint"   },
  { name: "Glass & Metal",    iconKey: "metal",      kg: 14.6, pct: 12, color: "#0284c7", bg: "bg-pastel-blue"   },
  { name: "E-Waste / Other",  iconKey: "electronic", kg: 6.1,  pct: 5,  color: "#7c3aed", bg: "bg-pastel-purple" },
];

const VECTOR: Record<string, string> = {
  plastic:    "/vectors/plastic.png",
  paper:      "/vectors/paper.png",
  glass:      "/vectors/glassa.png",
  metal:      "/vectors/metal.png",
  organic:    "/vectors/organic.png",
  electronic: "/vectors/electronics.png",
  battery:    "/vectors/harzardous.png",
  general:    "/vectors/general.png",
};

export function CategoryChart() {
  return (
    <div className="space-y-4">
      {/* Stacked progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {distributionData.map((d) => (
          <div
            key={d.name}
            className="h-full transition-all duration-500"
            style={{ width: `${d.pct}%`, backgroundColor: d.color }}
            title={`${d.name}: ${d.kg} kg (${d.pct}%)`}
          />
        ))}
      </div>

      {/* Cards — image fills the top, text underneath */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {distributionData.map((d) => (
          <div key={d.name} className={`rounded-2xl overflow-hidden border border-slate-200 ${d.bg}`}>
            {/* Full-bleed image — fills the square top section */}
            <div className="relative w-full aspect-square">
              <img
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover"
                src={VECTOR[d.iconKey]}
              />
            </div>
            {/* Info below */}
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-light text-slate-700 truncate">{d.name}</p>
              <p className="text-base font-medium text-slate-900 mt-0.5">
                {d.kg} <span className="text-xs font-light text-slate-500">kg</span>
              </p>
              <p className="text-[11px] font-light text-slate-500">{d.pct}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
