"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  IconSearch,
  IconScan,
  IconHome,
  IconSettings,
  IconRecycle,
  IconCalendar,
  IconChart,
  IconPlus,
  IconShield,
  IconMapPin,
} from "../ui/icons";
import { DEMO_USERS, getCurrentUser, setCurrentUser } from "@/lib/auth";
import { Tooltip } from "../ui/tooltip";

/* ── Primary Navigation Routes ── */
const NAV = [
  { label: "Home",      href: "/",            icon: IconHome     },
  { label: "Classify",  href: "/classify",    icon: IconScan     },
  { label: "Recycle",   href: "/recycling",   icon: IconRecycle  },
  { label: "Schedule",  href: "/collections", icon: IconCalendar },
  { label: "Impact",    href: "/dashboard",   icon: IconChart    },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [user, setUser]         = useState(getCurrentUser());
  const [searchOpen, setSearch] = useState(false);
  const [query, setQuery]       = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recycling?q=${encodeURIComponent(query.trim())}`);
      setSearch(false);
      setQuery("");
    }
  }

  function toggleAdmin() {
    const next = user.role === "admin" ? "citizen" : "admin";
    const u = DEMO_USERS[next];
    setCurrentUser(u);
    setUser(u);
    router.push(next === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f8f6] flex flex-col font-sans antialiased text-slate-900">

      {/* ══════════ TOP APPLICATION HEADER (FIXED & POLISHED) ══════════ */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Left: Brand Identity & Active Zone */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-2.5 shrink-0 group active:scale-95 transition-transform" href="/">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-sm border border-emerald-500/20 bg-emerald-50 flex items-center justify-center">
                <img alt="EnviRescue" className="h-full w-full object-cover" src="/logo.png" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Envi<span className="text-emerald-600">Rescue</span>
              </span>
            </Link>

            {/* Active Location Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 border border-slate-200/70 px-3 py-1 rounded-full shadow-xs">
              <IconMapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Zone: <span className="font-semibold text-slate-800">Zone A - North</span></span>
            </div>
          </div>

          {/* Center (Desktop): Modern Pill Segmented Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 rounded-2xl p-1.5 border border-slate-200/50 shadow-inner">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Tooltip key={href} label={label} position="bottom">
                <Link
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                    isActive(href)
                      ? "bg-white shadow-sm text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/50"
                  }`}
                  href={href}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Tooltip>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Button */}
            <Tooltip label="Search Guidelines" position="bottom">
              <button
                aria-label="Search"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
                onClick={() => setSearch((v) => !v)}
              >
                <IconSearch className="h-4.5 w-4.5" />
              </button>
            </Tooltip>

            {/* Report Waste CTA */}
            <Link
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all"
              href="/waste/new"
            >
              <IconPlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report Waste</span>
              <span className="sm:hidden">Report</span>
            </Link>

            {/* User Account Avatar Menu */}
            <div className="relative">
              <Tooltip label={user.fullName} position="bottom">
                <button
                  aria-label="User profile menu"
                  className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-xs font-bold hover:opacity-95 active:scale-95 transition-all shadow-xs"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {user.fullName.charAt(0)}
                </button>
              </Tooltip>

              {menuOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] font-normal text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  {[
                    { label: "Dashboard",   href: "/dashboard",       icon: IconChart    },
                    { label: "Waste Logs",  href: "/waste",           icon: IconCalendar },
                    { label: "Admin Panel", href: "/admin/dashboard", icon: IconShield   },
                    { label: "Settings",    href: "/settings",        icon: IconSettings },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      href={href}
                      key={href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <div className="mt-1.5 border-t border-slate-100 pt-1.5">
                    <button
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50/70 rounded-xl transition-colors"
                      onClick={() => { toggleAdmin(); setMenuOpen(false); }}
                    >
                      <IconShield className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{user.role === "admin" ? "Switch to User View" : "Switch to Admin View"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Interactive Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-slate-100 px-4 sm:px-6 py-2.5 bg-slate-50/80 backdrop-blur-md animate-in slide-in-from-top-2 duration-150">
            <form className="flex items-center gap-2 max-w-2xl mx-auto" onSubmit={handleSearch}>
              <input
                autoFocus
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 shadow-xs"
                placeholder="Search waste categories, disposal rules, items (e.g. bottle, carton)..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 transition-colors"
                type="button"
                onClick={() => setSearch(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ══════════ MAIN CONTENT CONTAINER ══════════ */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 pt-22 sm:pt-24 py-6 pb-32 md:pb-12">
        {children}
      </main>

      {/* ══════════ FLOATING DARK PILL NAVBAR (MOBILE APP EXPERIENCE) ══════════ */}
      <nav className="md:hidden fixed bottom-5 inset-x-0 mx-auto w-[94%] max-w-sm bg-[#0c1f17]/95 text-white rounded-3xl sm:rounded-full p-2 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.3),0_0_24px_rgba(16,185,129,0.15)] z-50 border border-emerald-500/20 backdrop-blur-2xl">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`transition-all duration-200 flex items-center justify-center active:scale-95 ${
                active
                  ? "bg-white text-slate-950 font-bold px-3.5 py-2.5 rounded-2xl sm:rounded-full shadow-md text-xs gap-1.5"
                  : "text-white/70 hover:text-white p-2.5 rounded-2xl"
              }`}
            >
              <Icon className={`${active ? "h-4 w-4 text-emerald-800 shrink-0" : "h-5 w-5"}`} />
              {active && <span className="tracking-tight">{label}</span>}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
