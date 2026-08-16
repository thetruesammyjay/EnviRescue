import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create EnviRescue Account</h1>
        <p className="text-xs text-slate-500 mt-1">Join in tracking and sorting waste for positive environmental impact.</p>
      </div>

      <AuthForm mode="register" />

      <p className="text-center text-xs text-slate-500">
        Already registered?{" "}
        <Link className="font-bold text-emerald-700 hover:text-emerald-800" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
