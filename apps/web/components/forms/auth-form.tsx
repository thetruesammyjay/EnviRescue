"use client";

import { Button } from "@envirescue/ui";
import { useState, type FormEvent } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("The form is ready to connect to the authentication API.");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      {mode === "register" ? (
        <label className="block text-sm font-medium">
          Full name
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="name" required />
        </label>
      ) : null}
      <label className="block text-sm font-medium">
        Email
        <input className="mt-1 w-full rounded-md border px-3 py-2" name="email" required type="email" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input className="mt-1 w-full rounded-md border px-3 py-2" minLength={8} name="password" required type="password" />
      </label>
      <Button className="w-full" type="submit">
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
