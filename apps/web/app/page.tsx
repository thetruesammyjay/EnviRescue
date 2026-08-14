import Link from "next/link";

const features = ["Waste reporting", "AI classification", "Recycling guidance", "Collection schedules", "Environmental dashboards", "Reports"];

export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-green-600 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-semibold uppercase tracking-widest text-emerald-200">Smarter waste decisions</p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight">Classify waste, recycle responsibly, and understand your impact.</h1>
          <p className="mt-6 max-w-2xl text-lg text-emerald-50">EnviRescue brings AI-assisted classification, practical recycling guidance, and waste tracking into one accessible platform.</p>
          <div className="mt-8 flex gap-4">
            <Link className="rounded-md bg-white px-5 py-3 font-semibold text-emerald-900" href="/register">Create account</Link>
            <Link className="rounded-md border border-white/60 px-5 py-3 font-semibold" href="/login">Sign in</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-3">
        {features.map((feature) => <div className="rounded-xl border bg-white p-6 font-semibold shadow-sm" key={feature}>{feature}</div>)}
      </section>
    </main>
  );
}
