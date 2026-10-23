import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Clock3, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Programmes" };
export const dynamic = "force-dynamic";

export default async function ProgrammesPage() {
  const programmes = await prisma.programme.findMany({
    orderBy: { order: "asc" },
    include: { feeItems: { where: { active: true }, orderBy: { amount: "desc" }, take: 1 } },
  });

  return (
    <>
      <PageHero
        eyebrow="Programmes"
        arabic="البرامج الدراسية"
        title="Choose the path that fits your stage of life."
        lead="Each programme has a defined curriculum, qualified teachers and clear outcomes. All are open to brothers and sisters in separate sections."
      />
      <section className="py-20">
        <div className="container space-y-8">
          {programmes.map((p, i) => (
            <article id={p.slug} key={p.id} className="card scroll-mt-32 overflow-hidden md:grid md:grid-cols-12">
              <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-walnut md:col-span-4">
                <div className="pattern-gold absolute inset-0 opacity-20" />
                <div className="arch absolute inset-x-10 bottom-0 top-8 border border-gold/40" />
                <p lang="ar" dir="rtl" className="relative px-8 text-center font-ruqaa text-4xl leading-snug text-gold-light">
                  {p.arabicTitle}
                </p>
                <span className="absolute left-6 top-5 font-display text-2xl text-gold/50">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="p-8 md:col-span-8 md:p-10">
                <h2 className="text-[2.2rem]">{p.title}</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{p.summary}</p>
                <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-3">
                  <div className="flex gap-3"><Clock3 size={18} className="mt-0.5 text-gold-dark" /><div><dt className="font-semibold">Duration</dt><dd className="text-ink-muted">{p.duration}</dd></div></div>
                  <div className="flex gap-3"><MapPin size={18} className="mt-0.5 text-gold-dark" /><div><dt className="font-semibold">Mode</dt><dd className="text-ink-muted">{p.mode}</dd></div></div>
                  <div className="flex gap-3"><CalendarClock size={18} className="mt-0.5 text-gold-dark" /><div><dt className="font-semibold">Schedule</dt><dd className="text-ink-muted">{p.schedule}</dd></div></div>
                </dl>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
                  <p className="text-sm text-ink-muted">
                    Tuition from <span className="font-display text-2xl font-semibold text-walnut">{p.feeItems[0] ? money(p.feeItems[0].amount) : "—"}</span> / session
                  </p>
                  <Link href={`/register?programme=${p.id}`} className="btn-primary btn-sm">
                    Apply for this programme <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {programmes.length === 0 && <p className="text-center text-ink-muted">No programmes yet — run the database seed.</p>}
        </div>
      </section>
    </>
  );
}
