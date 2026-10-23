"use client";

import { useActionState, useState } from "react";
import { ArrowRight, GraduationCap, UserPlus } from "lucide-react";
import { registerAction } from "@/app/actions/auth";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SelectField, SubmitButton } from "@/components/forms";

export function RegisterForm({
  programmes,
  defaultProgramme,
  defaultEntry,
}: {
  programmes: { value: string; label: string }[];
  defaultProgramme?: string;
  defaultEntry: "NEW_STUDENT" | "ALUMNUS";
}) {
  const [state, action] = useActionState(registerAction, initialState);
  const [entry, setEntry] = useState(defaultEntry);

  return (
    <form action={action} className="mt-10 space-y-8">
      <fieldset>
        <legend className="label">I am applying as</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { v: "NEW_STUDENT" as const, icon: UserPlus, t: "A new student", d: "Apply for admission" },
            { v: "ALUMNUS" as const, icon: GraduationCap, t: "A former student", d: "Join the alumni network" },
          ].map((o) => (
            <label
              key={o.v}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${entry === o.v ? "border-emerald bg-emerald/5 ring-4 ring-emerald/10" : "border-sand-dark/70 bg-white hover:border-emerald/40"}`}
            >
              <input type="radio" name="entryType" value={o.v} checked={entry === o.v} onChange={() => setEntry(o.v)} className="sr-only" />
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${entry === o.v ? "bg-emerald text-gold-light" : "bg-parchment text-emerald"}`}>
                <o.icon size={20} />
              </span>
              <span>
                <span className="block font-semibold">{o.t}</span>
                <span className="block text-[13px] text-ink-muted">{o.d}</span>
              </span>
            </label>
          ))}
        </div>
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
        <SelectField
          label={entry === "ALUMNUS" ? "Programme you completed" : "Programme"}
          name="programmeId"
          required
          placeholder="Choose a programme"
          defaultValue={defaultProgramme}
          options={programmes}
          state={state}
          className="sm:col-span-2"
        />
        <Field label="Password" name="password" type="password" required autoComplete="new-password" hint="At least 8 characters" state={state} />
        <Field label="Confirm password" name="confirm" type="password" required autoComplete="new-password" state={state} />
      </div>

      <FormMessage state={state} />
      <SubmitButton className="btn-primary w-full py-3.5" pendingText="Creating your account…">
        Create my account <ArrowRight size={17} />
      </SubmitButton>
      <p className="text-center text-[12.5px] text-ink-muted">By registering you agree to abide by the Markaz code of conduct.</p>
    </form>
  );
}
