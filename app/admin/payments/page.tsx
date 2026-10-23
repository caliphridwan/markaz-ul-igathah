import Link from "next/link";
import type { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { date, fullName, money } from "@/lib/format";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";

const STATUSES: PaymentStatus[] = ["SUCCESS", "PENDING", "FAILED"];

export default async function AdminPayments({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as PaymentStatus) ? (sp.status as PaymentStatus) : undefined;
  const [payments, sum] = await Promise.all([
    prisma.payment.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 150, include: { user: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
  ]);

  return (
    <>
      <PortalHeader title="Payments" arabic="المدفوعات">
        <span className="rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-ivory">Collected: {money(sum._sum.amount ?? 0)}</span>
      </PortalHeader>
      <div className="mb-5 flex flex-wrap gap-2">
        {[undefined, ...STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/payments?status=${s}` : "/admin/payments"}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${status === s ? "bg-ink text-ivory" : "border border-sand bg-white text-ink-soft hover:border-ink/30"}`}
          >
            {s ? s.toLowerCase() : "All"}
          </Link>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Date</th><th>Student</th><th>Purpose</th><th>Reference / Receipt</th><th>Amount</th><th>Status</th><th /></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap text-ink-muted">{date(p.paidAt ?? p.createdAt)}</td>
                <td><p className="font-semibold">{fullName(p.user)}</p><p className="text-[12.5px] text-ink-muted">{p.user.matricNo}</p></td>
                <td>{p.purpose}</td>
                <td className="font-mono text-[12px] text-ink-muted">{p.reference}<br />{p.receiptNo}</td>
                <td className="whitespace-nowrap font-semibold">{money(p.amount)}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.status === "SUCCESS" && <Link href={`/dashboard/receipts/${p.id}`} className="text-sm font-semibold text-emerald hover:underline">Receipt</Link>}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-ink-muted">No payments.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
