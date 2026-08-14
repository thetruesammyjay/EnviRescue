import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-emerald-950 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link className="text-xl font-bold text-emerald-800" href="/">EnviRescue</Link>
        {children}
      </div>
    </main>
  );
}
