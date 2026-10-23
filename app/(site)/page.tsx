import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, Landmark, Quote, ScrollText, Sparkles, UserPlus, CreditCard, IdCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { date } from "@/lib/format";
import { HeroArch } from "@/components/HeroArch";
import { Ornament, SectionHeading } from "@/components/Ornament";
import { SEGMENTS, SEGMENT_KEYS } from "@/lib/segments";

export const dynamic = "force-dynamic";

const pillars = [
  { icon: ScrollText, title: "Authentic chains", ar: "السند", body: "Every programme is taught by teachers who carry connected sanad and ijazah, preserving knowledge as it has always been transmitted — person to person." },
  { icon: BookOpen, title: "Classical & clear", ar: "المنهج", body: "A curriculum rooted in the classical texts, taught in clear language with modern teaching methods, assessments and progress reports." },
  { icon: HeartHandshake, title: "Tarbiyah first", ar: "التربية", body: "We teach adab before 'ilm. Mentorship, character formation and service to the community are woven into every term." },
  { icon: Landmark, title: "A lasting home", ar: "الانتماء", body: "From first registration to the alumni network, students belong to a community that keeps supporting them for life." },
];

const steps = [
  { icon: UserPlus, title: "Create your account", body: "Register online in minutes and receive your matric number instantly." },
  { icon: CreditCard, title: "Pay acceptance fee", body: "Pay securely online with card, transfer or USSD. Your account activates at once." },
  { icon: IdCard, title: "Get your ID card", body: "Upload a passport photo and print your official student identity card." },
  { icon: GraduationCap, title: "Begin your journey", body: "Attend orientation and start learning with your assigned halaqah and teacher." },
];

const testimonials = [
  { quote: "The teachers here corrected my recitation letter by letter. I completed my hifz in three years and received my ijazah with a sanad I can trace to the Prophet ﷺ.", name: "Aishah B.", role: "Tahfeez graduate, 2024" },
  { quote: "I came to learn the Arabic alphabet as an adult. Two years later I am reading classical texts with my own eyes. The evening classes made it possible.", name: "Ibrahim O.", role: "Adult Evening Classes" },
  { quote: "As a parent, the order and the warmth of the Madrasah stood out. My children look forward to weekends now.", name: "Mrs. Fatimah A.", role: "Parent, Children's Madrasah" },
];

export default async function HomePage() {
  const [programmes, announcements] = await Promise.all([
    prisma.programme.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 3 }),
  ]);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-parchment">
        <div className="pattern-ink absolute inset-0 opacity-[0.045]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
        <div className="container relative grid items-center gap-16 py-16 lg:grid-cols-12 lg:py-24">
          <div className="reveal lg:col-span-7">
            <span className="eyebrow">An Arabic & Islamic Institution</span>
            <h1 className="display mt-6">
              Where the Qur&apos;an is <em className="font-medium italic text-emerald">carried</em>, and character is <em className="font-medium italic text-emerald">formed</em>.
            </h1>
            <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-ink-muted">
              {site.name} raises huffadh, Arabic scholars and upright citizens through authentic, sanad-connected learning — in a home that remains yours long after graduation.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register" className="btn-primary px-7 py-3.5">
                Begin your application <ArrowRight size={17} />
              </Link>
              <Link href="/programmes" className="btn-ghost px-7 py-3.5">
                Explore programmes
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-5 border-t border-sand pt-7">
              <p lang="ar" dir="rtl" className="font-arabic text-[22px] text-emerald">
                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
              </p>
              <span className="hidden h-8 w-px bg-sand sm:block" />
              <p className="hidden text-[13.5px] italic text-ink-muted sm:block">
                &ldquo;The best of you are those who learn the Qur&apos;an and teach it.&rdquo; — al-Bukhari
              </p>
            </div>
          </div>
          <div className="reveal lg:col-span-5" style={{ animationDelay: ".15s" }}>
            <HeroArch />
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="relative z-10 -mt-6">
        <div className="container">
          <div className="grid grid-cols-2 divide-sand overflow-hidden rounded-3xl border border-sand bg-white shadow-card md:grid-cols-4 md:divide-x">
            {site.stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="font-display text-[2.7rem] font-semibold leading-none text-emerald">{s.value}</p>
                <p className="mt-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ABOUT TEASER ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-5">
              <div className="arch relative aspect-[3/4] overflow-hidden bg-emerald">
                <div className="pattern-gold absolute inset-0 opacity-25" />
                <p lang="ar" dir="rtl" className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-ruqaa text-5xl text-gold-light">
                  اقرأ
                </p>
              </div>
              <div className="mt-14 space-y-5">
                <div className="arch relative aspect-[3/4] overflow-hidden bg-gold/90">
                  <div className="pattern-ink absolute inset-0 opacity-20" />
                  <p lang="ar" dir="rtl" className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-ruqaa text-5xl text-emerald-900">
                    علم
                  </p>
                </div>
                <div className="rounded-2xl border border-sand bg-parchment p-5">
                  <p className="font-display text-4xl font-semibold text-emerald">{new Date().getFullYear() - site.founded}+</p>
                  <p className="text-sm text-ink-muted">years of teaching, mentoring and service</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About the Markaz"
              arabic="من نحن"
              title={<>A house of learning, built on <em className="italic text-emerald">ikhlas</em> and <em className="italic text-emerald">itqan</em>.</>}
              lead={`Founded in ${site.founded}, ${site.name} began as a small halaqah of Qur'an students and has grown into a full institution of Qur'an, Arabic and Islamic sciences — without losing the intimacy of a teacher who knows every student by name.`}
            />
            <ul className="mt-8 space-y-4">
              {["Small halaqat with personal follow-up", "Separate, well-supervised sections for brothers and sisters", "Transparent progress reports for students and guardians"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15.5px]">
                  <Sparkles size={18} className="mt-1 shrink-0 text-gold" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-9 inline-flex items-center gap-2 font-semibold text-emerald hover:gap-3 transition-all">
              Read our story <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- PROGRAMMES ---------- */}
      <section className="relative overflow-hidden bg-emerald-900 py-24 text-ivory sm:py-32">
        <div className="pattern-gold absolute inset-0 opacity-[0.06]" />
        <div className="container relative">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading light eyebrow="Programmes" arabic="البرامج" title="Paths of study for every stage of life." lead="From a child's first letters to a scholar's ijazah — each programme has a clear curriculum, qualified teachers and a defined end." />
            <Link href="/programmes" className="btn-outline-light shrink-0">
              All programmes <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((p, i) => (
              <Link
                key={p.id}
                href={`/programmes#${p.slug}`}
                className="group relative overflow-hidden rounded-[28px] border border-ivory/10 bg-emerald-800/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-emerald-800"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl font-semibold text-gold/30">{String(i + 1).padStart(2, "0")}</span>
                  <span lang="ar" dir="rtl" className="font-arabic text-xl text-gold-light">
                    {p.arabicTitle}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-[1.75rem] !text-ivory">{p.title}</h3>
                <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-ivory/65">{p.summary}</p>
                <div className="mt-6 flex items-center justify-between border-t border-ivory/10 pt-5 text-[13px] text-ivory/60">
                  <span>{p.duration}</span>
                  <ArrowRight size={17} className="text-gold transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
            {programmes.length === 0 && <p className="text-ivory/60">Programmes will appear here once the database is seeded.</p>}
          </div>
        </div>
      </section>

      {/* ---------- PILLARS ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <SectionHeading align="center" eyebrow="Why the Markaz" arabic="لماذا نحن" title="Four pillars that shape every student." />
          <Ornament className="mt-8" />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="card group p-7 transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald text-gold-light">
                    <p.icon size={22} />
                  </span>
                  <span lang="ar" dir="rtl" className="font-arabic text-xl text-gold-dark">
                    {p.ar}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl">{p.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- THE PATH ---------- */}
      <section className="bg-parchment py-24 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="Admission" arabic="القبول" title="Four steps from interest to your first class." lead="The whole journey happens online through your student portal — no queues, no paperwork lost." />
          <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 md:block" aria-hidden="true" />
          <ol className="relative grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative grid h-14 w-14 place-items-center rounded-full border border-gold bg-ivory text-emerald shadow-card">
                  <s.icon size={22} />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-emerald text-[11px] font-bold text-ivory">{i + 1}</span>
                </span>
                <h3 className="mt-6 text-[1.45rem]">{s.title}</h3>
                <p className="mt-2 text-[14.5px] text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          </div>
          <div className="mt-14">
            <Link href="/admissions" className="btn-primary">
              Requirements & fees <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- MUDIR ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="relative mx-auto max-w-4xl text-center">
            <Quote size={44} className="mx-auto text-gold" />
            <blockquote className="mt-8 font-display text-[1.9rem] font-medium leading-snug text-ink sm:text-[2.4rem]">
              &ldquo;Our aim is not only to fill hearts with the words of Allah, but to raise people whose conduct makes those words visible. Every student who leaves us should be a source of <em className="text-emerald">ighathah</em> — relief — for those around them.&rdquo;
            </blockquote>
            <Ornament className="mt-10" />
            <p className="mt-6 font-semibold">{site.mudir.name}</p>
            <p className="text-sm text-ink-muted">{site.mudir.title}</p>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="pb-24 sm:pb-32">
        <div className="container grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card flex flex-col p-8">
              <span className="font-display text-6xl leading-none text-gold/50">&ldquo;</span>
              <blockquote className="-mt-4 flex-1 text-[15.5px] leading-relaxed text-ink-soft">{t.quote}</blockquote>
              <figcaption className="mt-7 border-t border-sand pt-5">
                <p className="font-semibold">{t.name}</p>
                <p className="text-[13px] text-ink-muted">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- ANNOUNCEMENTS ---------- */}
      {announcements.length > 0 && (
        <section className="border-t border-sand bg-parchment/60 py-20">
          <div className="container">
            <SectionHeading eyebrow="Notice board" arabic="الإعلانات" title="From the Registry" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {announcements.map((a) => (
                <article key={a.id} className="card p-7">
                  <div className="flex items-center gap-3 text-[12.5px] font-semibold uppercase tracking-wider text-ink-muted">
                    {a.pinned && <span className="badge bg-gold/15 text-gold-dark ring-gold/30">Pinned</span>}
                    {date(a.createdAt)}
                  </div>
                  <h3 className="mt-4 text-[1.45rem] leading-snug">{a.title}</h3>
                  <p className="mt-3 line-clamp-4 text-[14.5px] text-ink-muted">{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- MEMBERSHIP ---------- */}
      <section className="py-24 sm:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-[32px] border border-sand bg-parchment p-8 sm:p-12">
            <div className="pattern-ink absolute inset-0 opacity-[0.04]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Congregation"
                  arabic="الجماعة"
                  title="Are you part of our masjid? Become a registered member."
                  lead="Members of the congregation can sign up online, join their segment and print a valid, QR-verifiable membership ID card."
                />
                <Link href="/membership" className="btn-primary mt-8">
                  Explore membership <ArrowRight size={16} />
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {SEGMENT_KEYS.map((k) => (
                  <li key={k}>
                    <Link href={`/membership/join?segment=${k}`} className="flex items-center gap-4 rounded-2xl border border-sand bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                      <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: SEGMENTS[k].color }} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{SEGMENTS[k].label}</span>
                        <span lang="ar" dir="rtl" className="block font-arabic text-[15px] text-gold-dark">{SEGMENTS[k].arabic}</span>
                      </span>
                      <ArrowRight size={16} className="text-ink-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden bg-emerald text-ivory">
        <div className="pattern-gold absolute inset-0 opacity-[0.08]" />
        <div className="container relative flex flex-col items-center py-24 text-center">
          <p lang="ar" dir="rtl" className="font-ruqaa text-4xl text-gold-light sm:text-5xl">
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <h2 className="h-section mt-6 max-w-3xl !text-ivory">Admissions for the {site.currentSession} session are open.</h2>
          <p className="mt-5 max-w-xl text-ivory/75">Create your account today. Your matric number is issued instantly and your portal is ready the moment you register.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-gold px-8 py-3.5">
              Apply now <ArrowRight size={17} />
            </Link>
            <Link href="/contact" className="btn-outline-light px-8 py-3.5">
              Speak to the Registry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
