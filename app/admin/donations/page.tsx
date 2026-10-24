import Link from "next/link";
import type { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { date, money } from "@/lib/format";
import { toggleCauseAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";
import { CauseForm } from "./CauseForm";

const STATUSES: PaymentStatus[] = ["SUCCESS", "PENDING", "FAILED"];

export default async function AdminDonations({ searchParams }: { searchParams: Promise<{ status?: string; cause?: string }> }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as PaymentStatus) ? (sp.status as PaymentStatus) : "SUCCESS";
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [causes, byCause, total, month, donations] = await Promise.all([
    prisma.donationCause.findMany({ orderBy: { order: "asc" } }),
    prisma.donation.groupBy({ by: ["causeId"], where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    prisma.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    prisma.donation.aggregate({ where: { status: "SUCCESS", paidAt: { gte: startOfMonth } }, _sum: { amount: true }, _count: true }),
    prisma.donation.findMany({
      where: { status, ...(sp.cause && { causeId: sp.cause }) },
      orderBy: { createdAt: "desc" },
      take: 150,
      include: { cause: true },
    }),
  ]);
  const sumFor = (id: string | null) => byCause.find((b) => b.causeId === id);
  const general = sumFor(null);

  return (
    <>
      <PortalHeader title="Donations" arabic="التبرعات">
        <Link href="/donate" className="btn-ghost btn-sm">View public page</Link>
      </PortalHeader>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">Total received</p>
          <p className="mt-3 font-display text-[2.1rem] font-semibold leading-none text-walnut">{money(total._sum.amount ?? 0)}</p>
          <p className="mt-2 text-sm text-ink-muted">{total._count} donations</p>
        </div>
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">This month</p>
          <p className="mt-3 font-display text-[2.1rem] font-semibold leading-none">{money(month._sum.amount ?? 0)}</p>
          <p className="mt-2 text-sm text-ink-muted">{month._count} donations</p>
        </div>
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">Average gift</p>
          <p className="mt-3 font-display text-[2.1rem] font-semibold leading-none">{money(total._count ? Math.round((total._sum.amount ?? 0) / total._count) : 0)}</p>
          <p className="mt-2 text-sm text-ink-muted">All time</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-2xl">Causes</h2>
          <div className="table-wrap">
            <table className="table !min-w-[560px]">
              <thead><tr><th>Cause</th><th>Raised</th><th>Goal</th><th>Donors</th><th>State</th></tr></thead>
              <tbody>
                {causes.map((c) => {
                  const r = sumFor(c.id);
                  const pct = c.goal ? Math.min(100, Math.round(((r?._sum.amount ?? 0) / c.goal) * 100)) : null;
                  return (
                    <tr key={c.id} className={c.active ? "" : "opacity-55"}>
                      <td>
                        <Link href={`/admin/donations?cause=${c.id}`} className="font-semibold hover:text-walnut">{c.title}</Link>
                        {pct !== null && (
                          <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-sand">
                            <div className="bar-grow h-full bg-walnut" style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap font-semibold text-walnut">{money(r?._sum.amount ?? 0)}</td>
                      <td className="whitespace-nowrap text-ink-muted">{c.goal ? money(c.goal) : "Ongoing"}</td>
                      <td>{r?._count ?? 0}</td>
                      <td>
                        <form action={toggleCauseAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className={`badge ${c.active ? "bg-jade/10 text-jade ring-jade/30" : "bg-sand text-ink-muted ring-sand-dark"}`}>
                            {c.active ? "shown" : "hidden"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
                {general && (
                  <tr>
                    <td className="font-semibold">General Fund (no cause)</td>
                    <td className="font-semibold text-walnut">{money(general._sum.amount ?? 0)}</td>
                    <td className="text-ink-muted">—</td>
                    <td>{general._count}</td>
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card h-fit p-6">
          <h2 className="text-2xl">New cause</h2>
          <CauseForm />
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">
            {sp.cause ? `Donations — ${causes.find((c) => c.id === sp.cause)?.title ?? "cause"}` : "All donations"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link
                key={s}
                href={`/admin/donations?status=${s}${sp.cause ? `&cause=${sp.cause}` : ""}`}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${status === s ? "bg-ink text-ivory" : "border border-sand bg-white text-ink-soft hover:border-ink/30"}`}
              >
                {s.toLowerCase()}
              </Link>
            ))}
            {sp.cause && <Link href="/admin/donations" className="rounded-full px-4 py-1.5 text-sm font-semibold text-walnut hover:underline">Clear</Link>}
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Donor</th><th>Cause</th><th>Amount</th><th>Receipt</th><th>Status</th></tr></thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="whitespace-nowrap text-ink-muted">{date(d.paidAt ?? d.createdAt)}</td>
                  <td>
                    <p className="font-semibold">{d.donorName}{d.anonymous && <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-gold-dark">anonymous</span>}</p>
                    <p className="text-[12.5px] text-ink-muted">{d.email}{d.phone && ` · ${d.phone}`}</p>
                    {d.message && <p className="mt-1 max-w-xs text-[12.5px] italic text-ink-muted">&ldquo;{d.message}&rdquo;</p>}
                  </td>
                  <td>{d.cause?.title ?? "General Fund"}</td>
                  <td className="whitespace-nowrap font-semibold">{money(d.amount)}</td>
                  <td>
                    {d.status === "SUCCESS" ? (
                      <Link href={`/donate/receipt/${encodeURIComponent(d.reference)}`} className="font-mono text-[12px] text-walnut hover:underline">{d.receiptNo}</Link>
                    ) : (
                      <span className="font-mono text-[12px] text-ink-muted">{d.reference}</span>
                    )}
                  </td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-ink-muted">No donations here yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
