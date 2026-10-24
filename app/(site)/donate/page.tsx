import type { Metadata } from "next";
import { AlertCircle, Building2, HeartHandshake, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { date, fullName, money } from "@/lib/format";
import { site } from "@/lib/site";
import { isDemoMode } from "@/lib/payments";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/Ornament";
import { DonateForm } from "./DonateForm";
import { CountUp } from "@/components/CountUp";

export const metadata: Metadata = { title: "Donate" };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  failed: "The donation was not completed and nothing was charged. You can try again.",
  unknown: "We couldn't find that donation. Please try again.",
};

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ cause?: string; error?: string }> }) {
  const sp = await searchParams;
  const [causes, raised, recent, totals, user] = await Promise.all([
    prisma.donationCause.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.donation.groupBy({ by: ["causeId"], where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    prisma.donation.findMany({ where: { status: "SUCCESS" }, orderBy: { paidAt: "desc" }, take: 8, include: { cause: true } }),
    prisma.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    getCurrentUser(),
  ]);
  const raisedFor = (id: string) => raised.find((r) => r.causeId === id);
  const initialCause = causes.find((c) => c.slug === sp.cause || c.id === sp.cause)?.id ?? causes[0]?.id ?? "";

  return (
    <>
      <PageHero
        eyebrow="Support the Markaz"
        arabic="تبرّع"
        title="Your sadaqah keeps the lamps of knowledge lit."
        lead="Every gift supports Qur'an teaching, sponsors students who cannot afford fees, and maintains the masjid for the whole community. Give once, give for a cause, or give where it is needed most."
      />

      <section className="py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          {/* ----- causes ----- */}
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Causes" arabic="أبواب الخير" title="Choose where your gift goes." />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {causes.map((c) => {
                const r = raisedFor(c.id);
                const sum = r?._sum.amount ?? 0;
                const pct = c.goal ? Math.min(100, Math.round((sum / c.goal) * 100)) : null;
                return (
                  <article key={c.id} id={c.slug} className="card flex scroll-mt-32 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[1.45rem] leading-snug">{c.title}</h3>
                      {c.arabicTitle && <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-lg text-gold-dark">{c.arabicTitle}</span>}
                    </div>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">{c.summary}</p>
                    <div className="mt-5">
                      {pct !== null ? (
                        <>
                          <div className="h-2 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                            <div className="bar-grow h-full rounded-full bg-gradient-to-r from-gold-dark to-walnut" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="mt-2 flex justify-between text-[13px]">
                            <span><strong className="text-walnut">{money(sum)}</strong> raised</span>
                            <span className="text-ink-muted">{pct}% of {money(c.goal!)}</span>
                          </p>
                        </>
                      ) : (
                        <p className="text-[13px]"><strong className="text-walnut">{money(sum)}</strong> <span className="text-ink-muted">raised · ongoing</span></p>
                      )}
                      <p className="mt-0.5 text-[12px] text-ink-muted">{r?._count ?? 0} donor{(r?._count ?? 0) === 1 ? "" : "s"}</p>
                    </div>
                  </article>
                );
              })}
              {causes.length === 0 && <p className="text-ink-muted">Causes will appear here once the database is seeded.</p>}
            </div>

            {/* bank transfer */}
            <div className="mt-10 rounded-2xl border border-gold/40 bg-parchment p-6">
              <h3 className="flex items-center gap-2 text-2xl"><Building2 size={20} className="text-gold-dark" /> Prefer bank transfer?</h3>
              <dl className="mt-4 grid gap-3 text-[15px] sm:grid-cols-3">
                <div><dt className="text-[12px] font-bold uppercase tracking-wider text-ink-muted">Bank</dt><dd className="font-semibold">{site.bank.bankName}</dd></div>
                <div><dt className="text-[12px] font-bold uppercase tracking-wider text-ink-muted">Account name</dt><dd className="font-semibold">{site.bank.accountName}</dd></div>
                <div><dt className="text-[12px] font-bold uppercase tracking-wider text-ink-muted">Account number</dt><dd className="font-mono text-lg font-bold tracking-wider text-walnut">{site.bank.accountNumber}</dd></div>
              </dl>
              <p className="mt-3 text-[13px] text-ink-muted">After a transfer, send your name and the cause to {site.email} or {site.phone} so the Registry can issue your receipt.</p>
            </div>
          </div>

          {/* ----- form ----- */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-t-[28px] bg-walnut p-7 text-ivory sm:p-8">
                <div className="pattern-gold pattern-drift absolute inset-0 opacity-[0.08]" />
                <div className="relative">
                  <p lang="ar" dir="rtl" className="font-arabic text-lg text-gold-light">مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ</p>
                  <h2 className="mt-2 font-display text-3xl !text-ivory">Make a donation</h2>
                  <p className="mt-1 text-[14px] text-ivory/70">Secure card, transfer or USSD payment. Receipt issued instantly.</p>
                </div>
              </div>
              <div className="card rounded-t-none border-t-0 p-6 sm:p-8">
                {sp.error && errors[sp.error] && (
                  <p className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" /> {errors[sp.error]}
                  </p>
                )}
                <DonateForm
                  causes={causes.map((c) => ({ value: c.id, label: c.title }))}
                  initialCause={initialCause}
                  defaults={user ? { donorName: fullName(user), email: user.email, phone: user.phone } : undefined}
                  demo={isDemoMode()}
                />
                <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ink-muted">
                  <ShieldCheck size={15} className="shrink-0 text-jade" /> Processed by Paystack. The Markaz never sees your card details.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ----- totals + recent donors ----- */}
      <section className="bg-walnut-900 py-20 text-ivory">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading light eyebrow="Together" arabic="معًا" title="What our community has given." />
            <p className="mt-8 font-display text-5xl font-semibold text-gold-light">
              <CountUp value={money(totals._sum.amount ?? 0)} duration={2200} />
            </p>
            <p className="mt-1 text-ivory/65">from {totals._count} donation{totals._count === 1 ? "" : "s"} — jazakumullahu khairan.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {recent.map((d) => (
              <li key={d.id} className="flex items-start gap-4 rounded-2xl border border-ivory/10 bg-ivory/5 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-light"><HeartHandshake size={18} /></span>
                <div className="min-w-0">
                  <p className="font-semibold text-ivory">{d.anonymous ? "A generous donor" : d.donorName.split(" ")[0]}</p>
                  <p className="text-[13px] text-ivory/60">{money(d.amount)} · {d.cause?.title ?? "General Fund"} · {date(d.paidAt)}</p>
                  {d.message && !d.anonymous && <p className="mt-1 line-clamp-2 text-[13px] italic text-ivory/75">&ldquo;{d.message}&rdquo;</p>}
                </div>
              </li>
            ))}
            {recent.length === 0 && <li className="text-ivory/60">Be the first to give.</li>}
          </ul>
        </div>
      </section>
    </>
  );
}
