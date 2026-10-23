import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { date } from "@/lib/format";
import { deleteAnnouncementAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";
import { AnnouncementForm } from "./AnnouncementForm";

export default async function AdminAnnouncements() {
  const items = await prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] });
  return (
    <>
      <PortalHeader title="Announcements" arabic="الإعلانات" />
      <div className="grid gap-8 lg:grid-cols-3">
        <section className="card h-fit p-6 lg:order-2">
          <h2 className="text-2xl">Publish</h2>
          <AnnouncementForm />
        </section>
        <div className="space-y-4 lg:col-span-2">
          {items.map((a) => (
            <article key={a.id} className="card flex gap-4 p-6">
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
                  {a.pinned && <span className="mr-2 text-gold-dark">Pinned ·</span>}
                  {date(a.createdAt)}
                </p>
                <h3 className="mt-1 text-xl">{a.title}</h3>
                <p className="mt-2 whitespace-pre-line text-[14.5px] text-ink-muted">{a.body}</p>
              </div>
              <form action={deleteAnnouncementAction}>
                <input type="hidden" name="id" value={a.id} />
                <button className="grid h-9 w-9 place-items-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete announcement">
                  <Trash2 size={17} />
                </button>
              </form>
            </article>
          ))}
          {items.length === 0 && <p className="text-ink-muted">No announcements yet.</p>}
        </div>
      </div>
    </>
  );
}
