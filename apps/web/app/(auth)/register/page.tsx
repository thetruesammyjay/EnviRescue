import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function RegisterPage() {
  return <><h1 className="mb-6 mt-8 text-3xl font-bold">Create account</h1><AuthForm mode="register" /><p className="mt-6 text-sm">Already registered? <Link className="font-semibold text-emerald-700" href="/login">Sign in</Link></p></>;
}
