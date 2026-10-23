import Link from "next/link";
import { prisma } from "@/lib/db";
import { date, fullName, money } from "@/lib/format";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";

export default async function AdminHome() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [byStatus, revenue, today, latest, recentPayments, members, pendingMembers] = await Promise.all([
    prisma.user.groupBy({ by: ["status"], where: { role: "STUDENT" }, _count: true }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    prisma.payment.aggregate({ where: { status: "SUCCESS", paidAt: { gte: startOfDay } }, _sum: { amount: true }, _count: true }),
    prisma.user.findMany({ where: { role: "STUDENT" }, orderBy: { createdAt: "desc" }, take: 6, include: { programme: true } }),
    prisma.payment.findMany({ where: { status: "SUCCESS" }, orderBy: { paidAt: "desc" }, take: 6, include: { user: true } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "MEMBER", status: "PENDING" } }),
  ]);
  const count = (s: string) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const total = byStatus.reduce((s, b) => s + b._count, 0);

  const tiles = [
    { label: "Total students", value: String(total), sub: `${count("ACTIVE")} active · ${count("GRADUATED")} alumni` },
    { label: "Awaiting action", value: String(count("PENDING") + pendingMembers), sub: `${count("PENDING")} students · ${pendingMembers} members`, href: "/admin/students?status=PENDING" },
    { label: "Congregation", value: String(members), sub: "Registered members", href: "/admin/members" },
    { label: "Revenue (all time)", value: money(revenue._sum.amount ?? 0), sub: `${revenue._count} successful payments` },
    { label: "Today", value: money(today._sum.amount ?? 0), sub: `${today._count} payments today` },
  ];

  return (
    <>
      <PortalHeader title="Registry overview" arabic="لوحة الإدارة" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => {
          const body = (
            <>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">{t.label}</p>
              <p className="mt-3 font-display text-[2.1rem] font-semibold leading-none text-ink">{t.value}</p>
              <p className="mt-2 text-sm text-ink-muted">{t.sub}</p>
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} className="card p-6 transition hover:shadow-lift">{body}</Link>
          ) : (
            <div key={t.label} className="card p-6">{body}</div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Latest registrations</h2>
            <Link href="/admin/students" className="text-sm font-semibold text-emerald hover:underline">All students</Link>
          </div>
          <ul className="mt-4 divide-y divide-sand">
            {latest.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{fullName(s)}</p>
                  <p className="truncate text-[13px] text-ink-muted">{s.matricNo} · {s.programme?.title} · {date(s.createdAt)}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
            {latest.length === 0 && <li className="py-6 text-center text-sm text-ink-muted">No students yet.</li>}
          </ul>
        </section>
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Recent payments</h2>
            <Link href="/admin/payments" className="text-sm font-semibold text-emerald hover:underline">All payments</Link>
          </div>
          <ul className="mt-4 divide-y divide-sand">
            {recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{fullName(p.user)}</p>
                  <p className="truncate text-[13px] text-ink-muted">{p.purpose} · {date(p.paidAt)}</p>
                </div>
                <p className="whitespace-nowrap font-display text-lg font-semibold text-emerald">{money(p.amount)}</p>
              </li>
            ))}
            {recentPayments.length === 0 && <li className="py-6 text-center text-sm text-ink-muted">No payments yet.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
