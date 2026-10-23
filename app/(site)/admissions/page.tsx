import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/Ornament";

export const metadata: Metadata = { title: "Admissions" };
export const dynamic = "force-dynamic";

const requirements = [
  "A valid email address and phone number",
  "A recent passport photograph (uploaded in your portal)",
  "Guardian details for applicants under 18",
  "For Tahfeez & Diploma: a short placement recitation or assessment",
];

const faqs = [
  { q: "When does the session begin?", a: `The ${site.currentSession} session begins after orientation. Exact dates are posted on the notice board and in your portal.` },
  { q: "Can I pay in instalments?", a: "Tuition can be split by term on request. Contact the Registry after paying your acceptance fee and a plan will be set up for you." },
  { q: "Are classes separate for brothers and sisters?", a: "Yes. All programmes run separate, supervised sections for brothers and sisters, taught by qualified teachers." },
  { q: "I studied here before. How do I join the alumni network?", a: "Register and select “I am a former student”. The Registry will confirm your record and open your alumni profile." },
  { q: "How do I get my ID card?", a: "Once your acceptance fee is paid and your passport photo is uploaded, your ID card is generated in your portal, ready to print." },
];

export default async function AdmissionsPage() {
  const fees = await prisma.feeItem.findMany({
    where: { active: true, session: site.currentSession },
    include: { programme: true },
    orderBy: [{ programmeId: { sort: "asc", nulls: "first" } }, { amount: "asc" }],
  });

  return (
    <>
      <PageHero eyebrow="Admissions" arabic="القبول والتسجيل" title="Your place at the Markaz begins here." lead={`Admissions for the ${site.currentSession} session are open for all programmes. The entire process happens online.`} />

      <section className="py-24">
        <div className="container grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Requirements" arabic="الشروط" title="What you need." />
            <ul className="mt-8 space-y-4">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-jade/10 text-jade"><Check size={14} /></span>
                  <span className="text-[16px]">{r}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-primary mt-10">Start application <ArrowRight size={16} /></Link>
          </div>
          <div>
            <SectionHeading eyebrow="Fee schedule" arabic="الرسوم" title={`${site.currentSession} session`} />
            <div className="table-wrap mt-8">
              <table className="table !min-w-0">
                <thead><tr><th>Item</th><th className="text-right">Amount</th></tr></thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <p className="font-semibold">{f.name}</p>
                        {f.description && <p className="text-[13px] text-ink-muted">{f.description}</p>}
                      </td>
                      <td className="whitespace-nowrap text-right font-display text-lg font-semibold text-emerald">{money(f.amount)}</td>
                    </tr>
                  ))}
                  {fees.length === 0 && <tr><td colSpan={2} className="text-center text-ink-muted">Fee schedule will be published soon.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-ink-muted">All payments are made securely through your student portal. Receipts are issued instantly.</p>
          </div>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="container max-w-3xl">
          <SectionHeading align="center" eyebrow="Questions" arabic="الأسئلة الشائعة" title="Frequently asked" />
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group card px-6 py-5 open:shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sand text-gold-dark transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
