"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS, setCurrentUser, setAccessToken } from "@/lib/auth";
import { IconLeaf, IconUser, IconShield } from "@/components/ui/icons";
import { Button } from "@envirescue/ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleDemoLogin(roleKey: "citizen" | "admin") {
    const user = DEMO_USERS[roleKey];
    setAccessToken("demo-jwt-token-envirescue");
    setCurrentUser(user);
    if (roleKey === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const citizen = {
        ...DEMO_USERS.citizen,
        email: email || DEMO_USERS.citizen.email,
        fullName: fullName || (mode === "register" ? "New Citizen" : DEMO_USERS.citizen.fullName),
      };
      setAccessToken("demo-jwt-token-envirescue");
      setCurrentUser(citizen);
      setSubmitting(false);
      router.push("/dashboard");
    }, 500);
  }

  return (
    <div className="space-y-6">
      {/* 1-Click Demo Login Options */}
      <div className="rounded-2xl bg-pastel-yellow border border-amber-300 p-4 space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-950">
          Fast Demo Login
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full text-xs"
            size="sm"
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("citizen")}
          >
            <IconUser className="h-4 w-4 text-emerald-700" />
            <span>Standard User</span>
          </Button>
          <Button
            className="w-full text-xs"
            size="sm"
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("admin")}
          >
            <IconShield className="h-4 w-4 text-amber-700" />
            <span>Admin Supervisor</span>
          </Button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <hr className="w-full border-slate-200" />
        <span className="absolute bg-white px-3 text-xs font-medium text-slate-400">
          Or continue with credentials
        </span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="e.g. Alex Taylor"
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="user@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Password
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="••••••••"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={submitting}
          size="lg"
          type="submit"
          variant="yellow"
        >
          <span>{submitting ? "Signing in..." : mode === "login" ? "Sign In" : "Create Account"}</span>
        </Button>
      </form>
    </div>
  );
}
