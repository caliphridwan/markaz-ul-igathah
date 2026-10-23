"use client";

import { useActionState } from "react";
import { createFeeAction } from "@/app/actions/admin";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SelectField, SubmitButton } from "@/components/forms";

export function FeeForm({ programmes, session }: { programmes: { value: string; label: string }[]; session: string }) {
  const [state, action] = useActionState(createFeeAction, initialState);
  return (
    <form action={action} className="mt-5 space-y-4">
      <Field label="Name" name="name" required placeholder="e.g. Second Term Tuition" state={state} />
      <Field label="Description" name="description" state={state} />
      <Field label="Amount (₦)" name="amount" type="number" min="1" step="0.01" required state={state} />
      <Field label="Session" name="session" required defaultValue={session} state={state} />
      <SelectField label="Applies to" name="programmeId" placeholder="All students" options={programmes} state={state} />
      <label className="flex items-center gap-3 text-[14px]">
        <input type="checkbox" name="activatesAccount" className="h-5 w-5 accent-emerald" />
        Paying this activates a pending account
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Create fee item</SubmitButton>
    </form>
  );
}
