const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 });

/** Format kobo as Naira currency. */
export function money(kobo: number) {
  return ngn.format(kobo / 100);
}

export function date(d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-NG", opts).format(new Date(d));
}

export function fullName(u: { firstName: string; lastName: string; otherName?: string | null }) {
  return [u.firstName, u.otherName, u.lastName].filter(Boolean).join(" ");
}

export function initials(u: { firstName: string; lastName: string }) {
  return `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase();
}

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function chunk(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ones[Math.floor(n / 100)]} hundred`);
    n %= 100;
    if (n) parts.push("and");
  }
  if (n >= 20) {
    parts.push(tens[Math.floor(n / 10)] + (n % 10 ? `-${ones[n % 10]}` : ""));
  } else if (n > 0) {
    parts.push(ones[n]);
  }
  return parts.join(" ");
}

function words(n: number): string {
  if (n === 0) return "zero";
  const scales = ["", "thousand", "million", "billion"];
  const out: string[] = [];
  let i = 0;
  while (n > 0) {
    const c = n % 1000;
    if (c) out.unshift(`${chunk(c)}${scales[i] ? " " + scales[i] : ""}`);
    n = Math.floor(n / 1000);
    i++;
  }
  return out.join(", ");
}

/** e.g. 1500050 kobo → "Fifteen thousand naira, fifty kobo only" */
export function amountInWords(kobo: number) {
  const naira = Math.floor(kobo / 100);
  const k = kobo % 100;
  let s = `${words(naira)} naira`;
  if (k) s += `, ${words(k)} kobo`;
  s += " only";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const statusStyles: Record<string, string> = {
  PENDING: "bg-gold/15 text-gold-dark ring-gold/30",
  ACTIVE: "bg-jade/10 text-jade ring-jade/30",
  GRADUATED: "bg-gold/15 text-walnut ring-gold/40",
  SUSPENDED: "bg-red-50 text-red-700 ring-red-200",
  SUCCESS: "bg-jade/10 text-jade ring-jade/30",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
};
