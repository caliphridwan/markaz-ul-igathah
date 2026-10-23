import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Linkedin, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { initials } from "@/lib/format";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Alumni" };
export const dynamic = "force-dynamic";

export default async function AlumniPage() {
  const alumni = await prisma.alumniProfile.findMany({
    where: { visible: true, user: { status: "GRADUATED" } },
    include: { user: { select: { firstName: true, lastName: true, photo: true, programme: { select: { title: true } } } } },
    orderBy: [{ graduationYear: "desc" }, { createdAt: "desc" }],
    take: 60,
  });

  return (
    <>
      <PageHero
        eyebrow="Alumni"
        arabic="الخريجون"
        title="Our graduates, carrying the light onward."
        lead="Huffadh, teachers, imams, professionals and parents — the alumni of the Markaz remain one family. Reconnect, mentor and stay part of the journey."
      />
      <section className="py-20">
        <div className="container">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-gold/30 bg-parchment p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl">Are you a graduate of the Markaz?</h2>
              <p className="mt-2 text-ink-muted">Create your account and choose “I am a former student”. Once confirmed, your profile joins this wall.</p>
            </div>
            <Link href="/register?entry=ALUMNUS" className="btn-primary shrink-0">Join the network <ArrowRight size={16} /></Link>
          </div>

          {alumni.length === 0 ? (
            <p className="py-16 text-center text-ink-muted">Alumni profiles will appear here as graduates join the network.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {alumni.map((a) => (
                <article key={a.id} className="card flex flex-col p-7">
                  <div className="flex items-center gap-4">
                    <div className="arch h-16 w-14 shrink-0 overflow-hidden bg-walnut">
                      {a.user.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.user.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center font-display text-xl text-gold-light">{initials(a.user)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl leading-tight">{a.user.firstName} {a.user.lastName}</h3>
                      <p className="text-[13px] text-ink-muted">{a.user.programme?.title ?? "Alumnus"} · Class of {a.graduationYear}</p>
                    </div>
                  </div>
                  {a.bio && <p className="mt-5 line-clamp-4 flex-1 text-[14.5px] text-ink-soft">{a.bio}</p>}
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-sand pt-4 text-[13px] text-ink-muted">
                    {a.occupation && <span className="flex items-center gap-1.5"><Briefcase size={14} />{a.occupation}</span>}
                    {a.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{a.location}</span>}
                    {a.linkedin && (
                      <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-walnut hover:underline">
                        <Linkedin size={14} />LinkedIn
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
