import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Ornament, SectionHeading } from "@/components/Ornament";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const values = [
  { ar: "الإخلاص", en: "Ikhlas", body: "Sincerity — learning and teaching for the sake of Allah alone." },
  { ar: "الإتقان", en: "Itqan", body: "Excellence — doing every lesson, every recitation, properly." },
  { ar: "الأدب", en: "Adab", body: "Refinement — honouring knowledge, teachers, parents and peers." },
  { ar: "الخدمة", en: "Khidmah", body: "Service — carrying what we learn back to our communities." },
];

const timeline = [
  { year: site.founded, text: "A single Qur'an halaqah begins after Fajr with eleven students." },
  { year: site.founded + 4, text: "Arabic Language programme added; the first huffadh complete their memorisation." },
  { year: site.founded + 9, text: "Move to a permanent campus with separate sections for brothers and sisters." },
  { year: site.founded + 14, text: "Diploma in Islamic Studies launched with a structured two-year curriculum." },
  { year: 2026, text: "Online admissions and the student portal open — the Markaz enters its next chapter." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About the Markaz" arabic="من نحن" title="Rooted in tradition. Devoted to the future." lead={site.description} />

      <section className="py-24">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our name" arabic="اسمنا" title={<>Why <em className="italic text-walnut">al-Ighathah</em>?</>} />
          </div>
          <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft lg:col-span-7">
            <p>
              <em>Ighathah</em> means succour — coming to the aid of someone in need. Our founders chose the name because they believed that the greatest relief one can give a person is
              guidance: the Book of Allah, the language in which it was revealed, and the understanding to live by it.
            </p>
            <p>
              That conviction still shapes everything we do. We keep classes small so that no student is invisible. We keep fees modest and offer support so that no sincere student is turned
              away. And we measure success not only by how much our students know, but by how they carry it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="card relative overflow-hidden p-10">
            <div className="pattern-ink absolute inset-0 opacity-[0.04]" />
            <span className="eyebrow relative">Vision</span>
            <p className="relative mt-5 font-display text-3xl leading-snug">To be a leading centre of Qur&apos;anic and Islamic scholarship whose graduates are a mercy to their communities.</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-walnut p-10 text-ivory shadow-card">
            <div className="pattern-gold absolute inset-0 opacity-10" />
            <span className="eyebrow relative !text-gold-light">Mission</span>
            <p className="relative mt-5 font-display text-3xl leading-snug text-ivory">To transmit authentic knowledge with connected chains, nurture sound character, and equip every student to serve.</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <SectionHeading align="center" eyebrow="Our values" arabic="قيمنا" title="What we hold to." />
          <Ornament className="mt-8" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.en} className="card p-8 text-center">
                <p lang="ar" dir="rtl" className="font-ruqaa text-4xl text-walnut">{v.ar}</p>
                <p className="mt-4 text-[12.5px] font-bold uppercase tracking-[0.2em] text-gold-dark">{v.en}</p>
                <p className="mt-3 text-[14.5px] text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-walnut-900 py-24 text-ivory">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading light eyebrow="Our journey" arabic="مسيرتنا" title="From a halaqah to an institution." />
          </div>
          <ol className="border-l border-gold/30 lg:col-span-8">
            {timeline.map((t) => (
              <li key={t.year} className="relative pb-10 pl-10 last:pb-0">
                <span className="absolute -left-[7px] top-2 h-3.5 w-3.5 rotate-45 border border-gold bg-walnut-900" />
                <p className="font-display text-3xl text-gold-light">{t.year}</p>
                <p className="mt-2 text-[16px] text-ivory/75">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24">
        <div className="container flex flex-col items-center text-center">
          <h2 className="h-section max-w-2xl">Come and see the Markaz for yourself.</h2>
          <p className="mt-4 max-w-xl text-ink-muted">Visits are welcome {site.hours}. Or begin your application online today.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/register" className="btn-primary">Apply now <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn-ghost">Plan a visit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
