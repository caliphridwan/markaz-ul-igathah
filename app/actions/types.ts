export type FormState = {
  error?: string;
  ok?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Echo of submitted values so forms keep their content after a failed submit (React 19 resets forms). */
  values?: Record<string, string>;
};

export const initialState: FormState = {};

const SKIP = new Set(["password", "confirm", "current", "photo"]);

export function echo(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((v, k) => {
    if (!SKIP.has(k) && typeof v === "string" && !k.startsWith("$")) out[k] = v;
  });
  return out;
}
