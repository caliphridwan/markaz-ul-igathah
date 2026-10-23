"use client";

import { useActionState, useState } from "react";
import { createFeeAction } from "@/app/actions/admin";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SelectField, SubmitButton } from "@/components/forms";

type Opt = { value: string; label: string };

export function FeeForm({ programmes, segments, session }: { programmes: Opt[]; segments: Opt[]; session: string }) {
  const [state, action] = useActionState(createFeeAction, initialState);
  const [audience, setAudience] = useState<"STUDENT" | "MEMBER">("STUDENT");
  return (
    <form action={action} className="mt-5 space-y-4">
      <fieldset>
        <legend className="label">Charged to</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["STUDENT", "MEMBER"] as const).map((a) => (
            <label key={a} className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition ${audience === a ? "border-emerald bg-emerald text-ivory" : "border-sand bg-white text-ink-soft"}`}>
              <input type="radio" name="audience" value={a} checked={audience === a} onChange={() => setAudience(a)} className="sr-only" />
              {a === "STUDENT" ? "Students" : "Members"}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Name" name="name" required placeholder={audience === "MEMBER" ? "e.g. Annual Membership Dues" : "e.g. Second Term Tuition"} state={state} />
      <Field label="Description" name="description" state={state} />
      <Field label="Amount (₦)" name="amount" type="number" min="1" step="0.01" required state={state} />
      <Field label="Session / year" name="session" required defaultValue={session} state={state} />
      {audience === "STUDENT" ? (
        <SelectField key="prog" label="Programme" name="programmeId" placeholder="All students" options={programmes} state={state} />
      ) : (
        <SelectField key="seg" label="Segment" name="segment" placeholder="All segments" options={segments} state={state} />
      )}
      <label className="flex items-center gap-3 text-[14px]">
        <input type="checkbox" name="activatesAccount" className="h-5 w-5 accent-emerald" />
        Paying this activates a pending {audience === "MEMBER" ? "membership" : "account"}
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Create fee item</SubmitButton>
    </form>
  );
}
