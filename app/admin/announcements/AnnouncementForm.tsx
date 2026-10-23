"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/app/actions/admin";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/forms";

export function AnnouncementForm() {
  const [state, action] = useActionState(createAnnouncementAction, initialState);
  return (
    <form action={action} className="mt-5 space-y-4">
      <Field label="Title" name="title" required state={state} />
      <TextArea label="Message" name="body" required state={state} />
      <label className="flex items-center gap-3 text-[14px]">
        <input type="checkbox" name="pinned" className="h-5 w-5 accent-walnut" />
        Pin to the top
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingText="Publishing…">Publish</SubmitButton>
    </form>
  );
}
