"use client";

import { useActionState } from "react";
import { saveAlumniAction } from "@/app/actions/student";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/forms";

export function AlumniForm({ defaults, visible }: { defaults: Record<string, string>; visible: boolean }) {
  const [state, action] = useActionState(saveAlumniAction, initialState);
  return (
    <form action={action} className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field label="Graduation year" name="graduationYear" type="number" required defaultValue={defaults.graduationYear} state={state} />
      <Field label="Occupation" name="occupation" placeholder="e.g. Imam, Teacher, Engineer" defaultValue={defaults.occupation} state={state} />
      <Field label="Location" name="location" placeholder="City, Country" defaultValue={defaults.location} state={state} />
      <Field label="LinkedIn (optional)" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" defaultValue={defaults.linkedin} state={state} />
      <TextArea label="Short bio" name="bio" maxLength={600} placeholder="What have you done since graduating? How can you help current students?" defaultValue={defaults.bio} state={state} className="sm:col-span-2" />
      <label className="flex items-center gap-3 sm:col-span-2">
        <input type="checkbox" name="visible" defaultChecked={visible} className="h-5 w-5 rounded border-sand-dark accent-walnut" />
        <span className="text-[14.5px]">Show my profile on the public alumni wall</span>
      </label>
      <div className="sm:col-span-2"><FormMessage state={state} /></div>
      <div className="sm:col-span-2"><SubmitButton pendingText="Saving…">Save alumni profile</SubmitButton></div>
    </form>
  );
}
