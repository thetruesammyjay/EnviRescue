import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sign in to EnviRescue</h1>
        <p className="text-xs text-slate-500 mt-1">Access your campus waste reports and eco points.</p>
      </div>

      <AuthForm mode="login" />

      <p className="text-center text-xs text-slate-500">
        New to EnviRescue?{" "}
        <Link className="font-bold text-emerald-700 hover:text-emerald-800" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
