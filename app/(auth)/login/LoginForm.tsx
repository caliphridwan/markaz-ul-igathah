"use client";

import { useActionState, useRef } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton } from "@/components/forms";

type Demo = { accounts: readonly { role: string; email: string; note: string }[]; password: string } | null;

export function LoginForm({ next, demo }: { next?: string; demo: Demo }) {
  const [state, action] = useActionState(loginAction, initialState);
  const form = useRef<HTMLFormElement>(null);

  function fill(email: string) {
    const f = form.current;
    if (!f || !demo) return;
    (f.elements.namedItem("email") as HTMLInputElement).value = email;
    (f.elements.namedItem("password") as HTMLInputElement).value = demo.password;
    f.requestSubmit();
  }

  return (
    <>
      {demo && (
        <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5">
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-gold-dark">
            <KeyRound size={15} /> Demo logins · password <span className="font-mono normal-case tracking-normal text-ink">{demo.password}</span>
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {demo.accounts.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => fill(a.email)}
                className="rounded-xl border border-sand bg-white px-3.5 py-2.5 text-left transition hover:border-walnut hover:shadow-card"
              >
                <span className="block text-[13.5px] font-semibold text-ink">{a.role}</span>
                <span className="block truncate font-mono text-[11.5px] text-ink-muted">{a.email}</span>
                <span className="block text-[11.5px] text-gold-dark">{a.note}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <form ref={form} action={action} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label="Email address" name="email" type="email" autoComplete="email" required state={state} />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required state={state} />
        <FormMessage state={state} />
        <SubmitButton className="btn-primary w-full py-3.5" pendingText="Signing in…">
          Log in <ArrowRight size={17} />
        </SubmitButton>
        <p className="text-center text-[13px] text-ink-muted">Forgot your password? Contact the Registry to reset it.</p>
      </form>
    </>
  );
}
