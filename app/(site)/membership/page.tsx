import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, IdCard, ShieldCheck, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { SEGMENTS, SEGMENT_KEYS } from "@/lib/segments";
import { PageHero } from "@/components/PageHero";
import { Ornament, SectionHeading } from "@/components/Ornament";

export const metadata: Metadata = { title: "Membership" };
export const dynamic = "force-dynamic";

const steps = [
  { icon: Users, title: "Choose your segment", body: "Join as one of the five segments of the jama'ah." },
  { icon: ShieldCheck, title: "Get confirmed", body: "Pay the membership dues online, or the Registry approves you directly." },
  { icon: IdCard, title: "Print your ID card", body: "Upload a passport photo and print your official, QR-verifiable membership card." },
];

export default async function MembershipPage() {
  const dues = await prisma.feeItem.findMany({ where: { active: true, audience: "MEMBER" }, orderBy: { amount: "asc" } });
  const counts = await prisma.user.groupBy({ by: ["segment"], where: { role: "MEMBER", status: "ACTIVE" }, _count: true });
  const countOf = (k: string) => counts.find((c) => c.segment === k)?._count ?? 0;

  return (
    <>
      <PageHero
        eyebrow="Membership"
        arabic="العضوية"
        title="One congregation. Five circles of belonging."
        lead="Members of the masjid and congregation of Markaz-ul-Igathah can register online, join their segment and carry a valid membership identity card."
      />

      <section className="py-24">
        <div className="container">
          <SectionHeading align="center" eyebrow="The segments" arabic="الأقسام" title="Find your place in the jama'ah." />
          <Ornament className="mt-8" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENT_KEYS.map((k) => {
              const s = SEGMENTS[k];
              return (
                <article key={k} className="card group relative flex flex-col overflow-hidden">
                  <div className="relative flex h-36 items-center justify-center overflow-hidden" style={{ backgroundColor: s.color }}>
                    <div className="pattern-gold absolute inset-0 opacity-20 transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                    <div className="arch absolute inset-x-12 bottom-0 top-6 border border-gold/40 transition-all duration-700 ease-out group-hover:inset-x-10 group-hover:border-gold/70" />
                    <p lang="ar" dir="rtl" className="relative font-ruqaa text-4xl text-gold-light">{s.arabic}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[1.7rem]">{s.label}</h3>
                      <span className="rounded-full bg-parchment px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink-muted">{s.code}</span>
                    </div>
                    <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-muted">{s.blurb}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-sand pt-5">
                      <span className="text-[13px] text-ink-muted">{countOf(k)} active member{countOf(k) === 1 ? "" : "s"}</span>
                      <Link href={`/membership/join?segment=${k}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-walnut transition-all group-hover:gap-2.5">
                        Join <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="container grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How it works" arabic="الخطوات" title="Your membership card in three steps." />
            <ol className="mt-10 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold bg-ivory text-walnut">
                    <s.icon size={20} />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-walnut text-[10px] font-bold text-ivory">{i + 1}</span>
                  </span>
                  <div>
                    <h3 className="text-[1.4rem]">{s.title}</h3>
                    <p className="text-[15px] text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/membership/join" className="btn-primary mt-10">Register as a member <ArrowRight size={16} /></Link>
          </div>
          <div>
            <SectionHeading eyebrow="Dues" arabic="الاشتراك" title="Membership dues" />
            <div className="table-wrap mt-8">
              <table className="table !min-w-0">
                <tbody>
                  {dues.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <p className="font-semibold">{f.name}</p>
                        <p className="text-[13px] text-ink-muted">{f.segment ? SEGMENTS[f.segment].label : "All segments"} · {f.session}</p>
                      </td>
                      <td className="whitespace-nowrap text-right font-display text-lg font-semibold text-walnut">{money(f.amount)}</td>
                    </tr>
                  ))}
                  {dues.length === 0 && <tr><td className="text-center text-ink-muted">No dues are currently set.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-ink-muted">Dues are paid securely in your member portal and receipts are issued instantly.</p>
          </div>
        </div>
      </section>
    </>
  );
}
