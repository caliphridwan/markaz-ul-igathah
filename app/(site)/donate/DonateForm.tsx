"use client";

import { useActionState, useState } from "react";
import { Heart } from "lucide-react";
import { donateAction } from "@/app/actions/donate";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SelectField, SubmitButton, TextArea } from "@/components/forms";

const PRESETS = [1000, 5000, 10000, 25000, 50000, 100000];
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export function DonateForm({
  causes,
  initialCause,
  defaults,
  demo,
}: {
  causes: { value: string; label: string }[];
  initialCause: string;
  defaults?: { donorName: string; email: string; phone: string };
  demo: boolean;
}) {
  const [state, action] = useActionState(donateAction, initialState);
  const [amount, setAmount] = useState<string>(state.values?.amount ?? "5000");
  const amountErr = state.fieldErrors?.amount?.[0];
  const n = Number(amount);

  return (
    <form action={action} className="space-y-5">
      {causes.length > 0 && (
        <SelectField label="Cause" name="causeId" defaultValue={initialCause} options={causes} state={state} />
      )}

      <fieldset>
        <legend className="label">Amount</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`rounded-xl border px-2 py-2.5 text-[14px] font-semibold transition ${n === p ? "border-walnut bg-walnut text-ivory" : "border-sand bg-white hover:border-walnut/50"}`}
            >
              {naira(p)}
            </button>
          ))}
        </div>
        <div className="relative mt-3">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-ink-muted">₦</span>
          <input
            name="amount"
            type="number"
            inputMode="numeric"
            min={100}
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Other amount in naira"
            aria-invalid={!!amountErr}
            className={`input pl-9 font-display text-xl font-semibold ${amountErr ? "input-error" : ""}`}
          />
        </div>
        {amountErr && <p className="mt-1.5 text-[12.5px] text-red-600">{amountErr}</p>}
      </fieldset>

      <Field label="Full name" name="donorName" required autoComplete="name" defaultValue={defaults?.donorName} state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email (for your receipt)" name="email" type="email" required autoComplete="email" defaultValue={defaults?.email} state={state} />
        <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" defaultValue={defaults?.phone} state={state} />
      </div>
      <TextArea label="Message or du'a request (optional)" name="message" maxLength={300} rows={3} className="[&_textarea]:min-h-[84px]" state={state} />
      <label className="flex items-center gap-3 text-[14px]">
        <input type="checkbox" name="anonymous" className="h-5 w-5 accent-walnut" />
        Keep my name private on the donor wall
      </label>

      <FormMessage state={state} />
      <SubmitButton className="btn-gold w-full py-3.5 text-[15px]" pendingText="Preparing secure payment…">
        <Heart size={17} /> Donate {n >= 100 ? naira(n) : ""}
      </SubmitButton>
      {demo && <p className="text-center text-[12px] text-gold-dark">Demo mode: donations complete instantly without a card.</p>}
    </form>
  );
}
