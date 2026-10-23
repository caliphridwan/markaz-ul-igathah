import Link from "next/link";
import { Receipt } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { date, money } from "@/lib/format";
import { PortalHeader } from "@/components/PortalNav";

export default async function ReceiptsPage() {
  const user = await requireUser();
  const receipts = await prisma.payment.findMany({ where: { userId: user.id, status: "SUCCESS" }, orderBy: { paidAt: "desc" } });
  return (
    <>
      <PortalHeader title="Receipts" arabic="الإيصالات" />
      {receipts.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <Receipt size={36} className="text-gold" />
          <p className="mt-4 font-display text-2xl">No receipts yet</p>
          <p className="mt-1 text-ink-muted">Receipts are issued automatically for every successful payment.</p>
          <Link href="/dashboard/payments" className="btn-primary mt-6">Go to payments</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => (
            <Link key={r.id} href={`/dashboard/receipts/${r.id}`} className="card group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="pattern-ink absolute inset-0 opacity-[0.03]" />
              <div className="relative">
                <p className="font-mono text-[12px] text-ink-muted">{r.receiptNo}</p>
                <h2 className="mt-3 text-xl leading-snug">{r.purpose}</h2>
                <div className="mt-6 flex items-end justify-between">
                  <p className="font-display text-2xl font-semibold text-emerald">{money(r.amount)}</p>
                  <p className="text-[13px] text-ink-muted">{date(r.paidAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
