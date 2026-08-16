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

/* ── Nav items for our routes ── */
const NAV = [
  { label: "Home",        href: "/",             icon: IconHome     },
  { label: "Classify",    href: "/classify",     icon: IconScan     },
  { label: "Recycling",   href: "/recycling",    icon: IconRecycle  },
  { label: "Schedule",    href: "/collections",  icon: IconCalendar },
  { label: "Dashboard",   href: "/dashboard",    icon: IconChart    },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [user, setUser]           = useState(getCurrentUser());
  const [searchOpen, setSearch]   = useState(false);
  const [query, setQuery]         = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);

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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8f8f6] flex flex-col">

      {/* ══════════ TOP HEADER (FIXED) ══════════ */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Left: Logo & Location */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-2 shrink-0" href="/">
              <img alt="EnviRescue" className="h-7 w-7 rounded-lg object-cover" src="/logo.png" />
              <span className="text-base font-semibold tracking-tight text-slate-900">
                Envi<span className="text-emerald-600">Rescue</span>
              </span>
            </Link>

            {/* Location tag */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-light text-slate-500 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full">
              <IconMapPin className="h-3 w-3 text-emerald-600" />
              <span>Location: <span className="font-medium text-slate-700">Zone A - North</span></span>
            </div>
          </div>

          {/* Center (Desktop): Icon Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Tooltip key={href} label={label} position="bottom">
                <Link
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                    isActive(href)
                      ? "bg-white shadow-sm text-emerald-700 font-medium"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  href={href}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Tooltip>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <Tooltip label="Search" position="bottom">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setSearch((v) => !v)}
              >
                <IconSearch className="h-4 w-4" />
              </button>
            </Tooltip>

            {/* Report CTA */}
            <Link
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl transition-colors"
              href="/waste/new"
            >
              <IconPlus className="h-3.5 w-3.5" />
              <span>Report Waste</span>
            </Link>

            {/* User Avatar Menu */}
            <div className="relative">
              <Tooltip label={user.fullName} position="bottom">
                <button
                  className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {user.fullName.charAt(0)}
                </button>
              </Tooltip>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-medium text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] font-light text-slate-500 mt-0.5">{user.email}</p>
                  </div>
                  {[
                    { label: "Dashboard",   href: "/dashboard",       icon: IconChart  },
                    { label: "Reports",     href: "/waste",           icon: IconCalendar },
                    { label: "Admin Panel", href: "/admin/dashboard", icon: IconShield },
                    { label: "Settings",    href: "/settings",        icon: IconSettings },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      className="flex items-center gap-2 px-3 py-2 text-xs font-light text-slate-700 hover:bg-slate-50 rounded-xl"
                      href={href}
                      key={href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      {label}
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-slate-100 pt-1">
                    <button
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-light text-slate-700 hover:bg-slate-50 rounded-xl"
                      onClick={() => { toggleAdmin(); setMenuOpen(false); }}
                    >
                      <IconShield className="h-3.5 w-3.5 text-emerald-600" />
                      {user.role === "admin" ? "Switch to Citizen" : "Switch to Admin"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible search bar */}
        {searchOpen && (
          <div className="border-t border-slate-100 px-4 sm:px-6 py-2 bg-slate-50/50">
            <form className="flex items-center gap-2" onSubmit={handleSearch}>
              <input
                autoFocus
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-light text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                placeholder="Search waste categories, disposal rules..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="text-xs font-light text-slate-500 hover:text-slate-800 px-2"
                type="button"
                onClick={() => setSearch(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ══════════ PAGE CONTENT ══════════ */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 pt-20 py-6 pb-28 md:pb-10">
        {children}
      </main>

      {/* ══════════ FLOATING DARK PILL NAVBAR (MOBILE) ══════════ */}
      <nav className="md:hidden fixed bottom-4 inset-x-0 mx-auto w-[92%] max-w-xs bg-[#11241c] text-white rounded-full p-1.5 flex items-center justify-between shadow-2xl z-50 border border-white/10 backdrop-blur-md">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`transition-all duration-200 flex items-center justify-center ${
                active
                  ? "bg-white text-slate-900 font-medium px-3.5 py-1.5 rounded-full shadow-sm text-xs gap-1.5"
                  : "text-white/70 hover:text-white p-2 rounded-full"
              }`}
            >
              <Icon className={`${active ? "h-3.5 w-3.5 text-emerald-800" : "h-4 w-4"}`} />
              {active && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
