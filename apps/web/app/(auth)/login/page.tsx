import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function LoginPage() {
  return <><h1 className="mb-6 mt-8 text-3xl font-bold">Sign in</h1><AuthForm mode="login" /><p className="mt-6 text-sm">No account? <Link className="font-semibold text-emerald-700" href="/register">Register</Link></p></>;
}
