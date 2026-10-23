import { Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { date } from "@/lib/format";
import { toggleMessageReadAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <PortalHeader title="Messages" arabic="الرسائل" />
      <div className="space-y-4">
        {messages.map((m) => (
          <article key={m.id} className={`card p-6 ${m.read ? "opacity-70" : "border-l-4 border-l-gold"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl">{m.subject}</h3>
                <p className="text-[13px] text-ink-muted">
                  {m.name} · <a href={`mailto:${m.email}`} className="text-walnut hover:underline">{m.email}</a>
                  {m.phone && ` · ${m.phone}`} · {date(m.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`} className="btn-ghost btn-sm"><Mail size={15} /> Reply</a>
                <form action={toggleMessageReadAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-ghost btn-sm">{m.read ? "Mark unread" : "Mark read"}</button>
                </form>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] text-ink-soft">{m.message}</p>
          </article>
        ))}
        {messages.length === 0 && <p className="text-ink-muted">The inbox is empty.</p>}
      </div>
    </>
  );
}
