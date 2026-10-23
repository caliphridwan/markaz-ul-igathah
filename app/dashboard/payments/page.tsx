import Link from "next/link";
import { AlertCircle, CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { feesForUser } from "@/lib/fees";
import { date, money } from "@/lib/format";
import { isDemoMode } from "@/lib/payments";
import { startPaymentAction } from "@/app/actions/student";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/forms";

const errors: Record<string, string> = {
  invalid: "That fee item is not available for your programme.",
  config: "Online payment is not configured yet. Please contact the Registry.",
  gateway: "We couldn't reach the payment gateway. Please try again in a moment.",
  failed: "The payment was not completed. No money has been recorded — you can try again.",
  missing: "Payment reference missing.",
  unknown: "We couldn't find that payment.",
};

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await requireUser();
  const [fees, history] = await Promise.all([
    feesForUser(user),
    prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  const demo = isDemoMode();

  return (
    <>
      <PortalHeader title="Payments" arabic="المدفوعات" />

      {error && errors[error] && (
        <p className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {errors[error]}
        </p>
      )}
      {demo && (
        <p className="mb-6 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-dark">
          <Sparkles size={18} className="mt-0.5 shrink-0" /> Demo mode: payments complete instantly without a card. Add a Paystack key to go live.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {fees.map((f) => (
          <div key={f.id} className={`card relative flex flex-col overflow-hidden p-6 ${f.paymentId ? "bg-parchment/50" : ""}`}>
            {f.activatesAccount && !f.paymentId && <span className="absolute right-0 top-0 rounded-bl-2xl bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">Required</span>}
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">{f.session}</p>
            <h2 className="mt-2 text-2xl">{f.name}</h2>
            {f.description && <p className="mt-1 text-[14px] text-ink-muted">{f.description}</p>}
            <div className="mt-6 flex flex-1 items-end justify-between gap-4">
              <p className="font-display text-3xl font-semibold text-emerald">{money(f.amount)}</p>
              {f.paymentId ? (
                <Link href={`/dashboard/receipts/${f.paymentId}`} className="btn-ghost btn-sm">
                  <CheckCircle2 size={16} className="text-jade" /> Paid · Receipt
                </Link>
              ) : (
                <form action={startPaymentAction}>
                  <input type="hidden" name="feeItemId" value={f.id} />
                  <SubmitButton className="btn-primary btn-sm" pendingText="Redirecting…">
                    <Lock size={14} /> Pay now
                  </SubmitButton>
                </form>
              )}
            </div>
          </div>
        ))}
        {fees.length === 0 && <p className="text-ink-muted">No fees are currently assigned to your programme.</p>}
      </div>

      <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-muted">
        <ShieldCheck size={16} className="text-jade" /> Payments are processed securely by Paystack. The Markaz never sees or stores your card details.
      </p>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl">Transaction history</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Purpose</th><th>Reference</th><th>Amount</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {history.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap text-ink-muted">{date(p.createdAt)}</td>
                  <td className="font-semibold">{p.purpose}</td>
                  <td className="font-mono text-[12.5px] text-ink-muted">{p.reference}</td>
                  <td className="whitespace-nowrap font-semibold">{money(p.amount)}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="text-right">
                    {p.status === "SUCCESS" && <Link href={`/dashboard/receipts/${p.id}`} className="text-sm font-semibold text-emerald hover:underline">Receipt</Link>}
                  </td>
                </tr>
              ))}
              {history.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-ink-muted">No transactions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
