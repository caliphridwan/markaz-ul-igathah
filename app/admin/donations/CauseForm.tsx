"use client";

import { useActionState } from "react";
import { createCauseAction } from "@/app/actions/admin";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/forms";

export function CauseForm() {
  const [state, action] = useActionState(createCauseAction, initialState);
  return (
    <form action={action} className="mt-5 space-y-4">
      <Field label="Title" name="title" required placeholder="e.g. New classroom block" state={state} />
      <Field label="Arabic title (optional)" name="arabicTitle" dir="rtl" lang="ar" state={state} />
      <TextArea label="Short description" name="summary" required rows={3} state={state} />
      <Field label="Goal in ₦ (optional)" name="goal" type="number" min="1" step="any" hint="Leave empty for an ongoing cause" state={state} />
      <FormMessage state={state} />
      <SubmitButton pendingText="Saving…">Create cause</SubmitButton>
    </form>
  );
}
