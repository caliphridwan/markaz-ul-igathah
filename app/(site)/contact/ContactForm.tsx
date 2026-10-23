"use client";

import { useActionState } from "react";
import { contactAction } from "@/app/actions/contact";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/forms";

export function ContactForm() {
  const [state, action] = useActionState(contactAction, initialState);
  if (state.ok) return <div className="mt-8"><FormMessage state={state} /></div>;
  return (
    <form action={action} className="mt-8 grid gap-5 sm:grid-cols-2">
      <Field label="Full name" name="name" state={state} required autoComplete="name" />
      <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
      <Field label="Phone (optional)" name="phone" state={state} autoComplete="tel" />
      <Field label="Subject" name="subject" state={state} required />
      <TextArea label="Message" name="message" state={state} required className="sm:col-span-2" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="sm:col-span-2"><FormMessage state={state} /></div>
      <div className="sm:col-span-2"><SubmitButton pendingText="Sending…">Send message</SubmitButton></div>
    </form>
  );
}
