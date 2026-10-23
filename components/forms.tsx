"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { FormState } from "@/app/actions/types";

export function SubmitButton({ children, className = "btn-primary", pendingText }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.ok)
    return (
      <p role="status" className="flex items-start gap-2 rounded-xl border border-jade/25 bg-jade/5 px-4 py-3 text-sm text-jade">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {state.ok}
      </p>
    );
  if (state.error)
    return (
      <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle size={18} className="mt-0.5 shrink-0" /> {state.error}
      </p>
    );
  return null;
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  state?: FormState;
  hint?: string;
};

export function Field({ label, name, state, hint, className = "", defaultValue, ...rest }: FieldProps) {
  const err = state?.fieldErrors?.[name]?.[0];
  const dv = rest.type === "password" ? undefined : (state?.values?.[name] ?? defaultValue);
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input id={name} name={name} className={`input ${err ? "input-error" : ""}`} aria-invalid={!!err} aria-describedby={err ? `${name}-err` : undefined} defaultValue={dv} {...rest} />
      {err ? (
        <p id={`${name}-err`} className="mt-1.5 text-[12.5px] text-red-600">{err}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  state?: FormState;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({ label, name, state, options, placeholder, className = "", defaultValue, ...rest }: SelectProps) {
  const err = state?.fieldErrors?.[name]?.[0];
  const dv = state?.values?.[name] ?? defaultValue;
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <select id={name} name={name} className={`input appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10 ${err ? "input-error" : ""}`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%235E6B65'%3E%3Cpath d='M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z'/%3E%3C/svg%3E\")" }} aria-invalid={!!err} defaultValue={dv} key={String(dv ?? "")} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {err && <p className="mt-1.5 text-[12.5px] text-red-600">{err}</p>}
    </div>
  );
}

export function TextArea({ label, name, state, className = "", defaultValue, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string; state?: FormState }) {
  const err = state?.fieldErrors?.[name]?.[0];
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <textarea id={name} name={name} className={`input min-h-[130px] ${err ? "input-error" : ""}`} aria-invalid={!!err} defaultValue={state?.values?.[name] ?? defaultValue} {...rest} />
      {err && <p className="mt-1.5 text-[12.5px] text-red-600">{err}</p>}
    </div>
  );
}
