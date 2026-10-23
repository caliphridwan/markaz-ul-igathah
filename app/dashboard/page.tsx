import Link from "next/link";
import { ArrowRight, CreditCard, IdCard, Receipt, UserRound, Megaphone, AlertTriangle, PartyPopper } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { feesForUser } from "@/lib/fees";
import { date, money } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { welcome } = await searchParams;
  const user = await requireUser();
  const [fees, recent, announcements] = await Promise.all([
    feesForUser(user),
    prisma.payment.findMany({ where: { userId: user.id, status: "SUCCESS" }, orderBy: { paidAt: "desc" }, take: 5 }),
    prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 4 }),
  ]);
  const outstanding = fees.filter((f) => !f.paymentId);
  const outstandingTotal = outstanding.reduce((s, f) => s + f.amount, 0);
  const paidTotal = recent.reduce((s, p) => s + p.amount, 0);
  const hour = new Date().toLocaleString("en-NG", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" });
  const greet = Number(hour) < 12 ? "Good morning" : Number(hour) < 17 ? "Good afternoon" : "Good evening";

  const tasks = [
    !user.photo && { href: "/dashboard/profile", text: "Upload your passport photograph", icon: UserRound },
    user.status === "PENDING" && user.entryType === "NEW_STUDENT" && { href: "/dashboard/payments", text: "Pay your acceptance fee to activate your account", icon: CreditCard },
    user.status === "PENDING" && user.entryType === "ALUMNUS" && { href: "/dashboard/alumni", text: "Awaiting Registry confirmation of your alumni record", icon: AlertTriangle },
    (user.status === "ACTIVE" || user.status === "GRADUATED") && user.photo && { href: "/dashboard/id-card", text: "Your ID card is ready to print", icon: IdCard },
  ].filter(Boolean) as { href: string; text: string; icon: typeof UserRound }[];

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-5">
          <PartyPopper className="mt-0.5 shrink-0 text-gold-dark" />
          <div>
            <p className="font-semibold">Welcome to the Markaz, {user.firstName}! Your account has been created.</p>
            <p className="text-sm text-ink-muted">Your matric number is <strong>{user.matricNo}</strong>. Keep it safe — you&apos;ll need it on campus.</p>
          </div>
        </div>
      )}

      {/* hero card */}
      <section className="relative overflow-hidden rounded-[28px] bg-emerald p-8 text-ivory shadow-lift sm:p-10">
        <div className="pattern-gold absolute inset-0 opacity-[0.1]" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-gold/20" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p lang="ar" dir="rtl" className="font-arabic text-xl text-gold-light">السلام عليكم ورحمة الله</p>
            <h1 className="mt-2 font-display text-4xl !text-ivory sm:text-5xl">{greet}, {user.firstName}.</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-ivory/75">
              <span className="rounded-full bg-ivory/10 px-3 py-1 font-semibold tracking-wide text-ivory">{user.matricNo}</span>
              <span>{user.programme?.title ?? "No programme"}</span>
              <span className="text-ivory/30">•</span>
              <span>{user.session}</span>
              <StatusBadge status={user.status} />
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/payments" className="btn-gold">Make a payment</Link>
            <Link href="/dashboard/id-card" className="btn-outline-light">ID card</Link>
          </div>
        </div>
      </section>

      {/* stat tiles */}
      <section className="grid gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">Outstanding</p>
          <p className="mt-3 font-display text-4xl font-semibold text-ink">{money(outstandingTotal)}</p>
          <p className="mt-1 text-sm text-ink-muted">{outstanding.length} unpaid item{outstanding.length === 1 ? "" : "s"}</p>
        </div>
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">Recently paid</p>
          <p className="mt-3 font-display text-4xl font-semibold text-emerald">{money(paidTotal)}</p>
          <p className="mt-1 text-sm text-ink-muted">Last {recent.length} payment{recent.length === 1 ? "" : "s"}</p>
        </div>
        <div className="card p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">Account status</p>
          <p className="mt-3 font-display text-4xl font-semibold capitalize text-ink">{user.status.toLowerCase()}</p>
          <p className="mt-1 text-sm text-ink-muted">Registered {date(user.createdAt)}</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          {tasks.length > 0 && (
            <section className="card p-6">
              <h2 className="text-2xl">Next steps</h2>
              <ul className="mt-4 divide-y divide-sand">
                {tasks.map((t) => (
                  <li key={t.text}>
                    <Link href={t.href} className="group flex items-center gap-4 py-3.5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-parchment text-emerald"><t.icon size={18} /></span>
                      <span className="flex-1 text-[15px]">{t.text}</span>
                      <ArrowRight size={17} className="text-gold-dark transition group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Recent payments</h2>
              <Link href="/dashboard/receipts" className="text-sm font-semibold text-emerald hover:underline">All receipts</Link>
            </div>
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">No payments yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-sand">
                {recent.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 py-3.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-jade/10 text-jade"><Receipt size={18} /></span>
                    <div className="flex-1">
                      <p className="font-semibold">{p.purpose}</p>
                      <p className="text-[13px] text-ink-muted">{p.receiptNo} · {date(p.paidAt)}</p>
                    </div>
                    <p className="font-display text-lg font-semibold">{money(p.amount)}</p>
                    <Link href={`/dashboard/receipts/${p.id}`} className="btn-ghost btn-sm">View</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="card h-fit p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl"><Megaphone size={20} className="text-gold-dark" /> Notice board</h2>
          <ul className="mt-4 space-y-5">
            {announcements.map((a) => (
              <li key={a.id} className="border-l-2 border-gold/60 pl-4">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">{date(a.createdAt)}</p>
                <p className="mt-1 font-semibold">{a.title}</p>
                <p className="mt-1 text-[14px] text-ink-muted">{a.body}</p>
              </li>
            ))}
            {announcements.length === 0 && <li className="text-sm text-ink-muted">No announcements.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
