"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { joinMembershipAction } from "@/app/actions/membership";
import { initialState } from "@/app/actions/types";
import { SEGMENTS, SEGMENT_KEYS, type SegmentKey } from "@/lib/segments";
import { Field, FormMessage, SelectField, SubmitButton } from "@/components/forms";

export function JoinForm({ initialSegment }: { initialSegment: SegmentKey }) {
  const [state, action] = useActionState(joinMembershipAction, initialState);
  const [segment, setSegment] = useState<SegmentKey>((state.values?.segment as SegmentKey) || initialSegment);
  const segErr = state.fieldErrors?.segment?.[0];

  return (
    <form action={action} className="mt-10 space-y-8">
      <fieldset>
        <legend className="label">Segment</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEGMENT_KEYS.map((k) => {
            const s = SEGMENTS[k];
            const on = segment === k;
            return (
              <label
                key={k}
                className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${on ? "border-walnut bg-walnut/5 ring-4 ring-walnut/10" : "border-sand-dark/70 bg-white hover:border-walnut/40"}`}
              >
                <input type="radio" name="segment" value={k} checked={on} onChange={() => setSegment(k)} className="sr-only" />
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gold-light" style={{ backgroundColor: s.color }}>
                  <span lang="ar" className="font-arabic text-[13px] leading-none">{s.arabic.split(" ")[0]}</span>
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{s.label}</span>
                  <span lang="ar" dir="rtl" className="block font-arabic text-[14px] text-gold-dark">{s.arabic}</span>
                </span>
                {on && <Check size={18} className="absolute right-4 top-4 text-walnut" />}
              </label>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-ink-muted">{SEGMENTS[segment].blurb}</p>
        {segErr && <p className="mt-1.5 text-[12.5px] text-red-600">{segErr}</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="First name" name="firstName" required autoComplete="given-name" state={state} />
        <Field label="Other name" name="otherName" autoComplete="additional-name" state={state} />
        <Field label="Surname" name="lastName" required autoComplete="family-name" state={state} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" name="email" type="email" required autoComplete="email" state={state} />
        <Field label="Phone number" name="phone" type="tel" required autoComplete="tel" placeholder="080 0000 0000" state={state} />
        <SelectField
          label="Gender"
          name="gender"
          required
          placeholder="Select"
          state={state}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
        />
        <Field label="Date of birth" name="dateOfBirth" type="date" state={state} />
        <Field label="Occupation" name="occupation" state={state} />
        <Field label="Residential address" name="address" autoComplete="street-address" state={state} />
        <Field label="Password" name="password" type="password" required autoComplete="new-password" hint="At least 8 characters" state={state} />
        <Field label="Confirm password" name="confirm" type="password" required autoComplete="new-password" state={state} />
      </div>

      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full py-3.5" pendingText="Registering…">
        Register as a member <ArrowRight size={17} />
      </SubmitButton>
    </form>
  );
}
