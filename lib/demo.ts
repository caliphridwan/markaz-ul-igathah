/**
 * Demo accounts. Created by `npm run db:seed` and shown on the login page
 * only while DEMO_MODE="true". Turn DEMO_MODE off before going live.
 */
export const DEMO_PASSWORD = "Demo@2026";

export const demoAccounts = [
  { role: "Admin", email: "demo.admin@markazuligathah.org", note: "Registry dashboard" },
  { role: "Active student", email: "student@markazuligathah.org", note: "Receipts & ID card ready" },
  { role: "New applicant", email: "applicant@markazuligathah.org", note: "Try paying the acceptance fee" },
  { role: "Alumnus", email: "alumni@markazuligathah.org", note: "Alumni profile" },
  { role: "Member · Ibadur Rahman", email: "member@markazuligathah.org", note: "Member ID card & dues receipt" },
  { role: "Member · pending", email: "general.demo@markazuligathah.org", note: "Pay dues → membership activates" },
] as const;

export function isDemoLoginEnabled() {
  return process.env.DEMO_MODE === "true";
}
