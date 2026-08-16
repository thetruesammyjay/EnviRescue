import Link from "next/link";
import type { ReactNode } from "react";
import { IconLeaf } from "@/components/ui/icons";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fafaf9] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 space-y-6">
        <Link className="inline-flex items-center gap-2 font-bold tracking-tight text-slate-900" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <IconLeaf className="h-6 w-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Envi<span className="text-emerald-600">Rescue</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-amber-600 uppercase mt-0.5">
              Campus Waste Network
            </span>
          </div>
        </Link>
        {children}
      </div>
    </main>
  );
}
