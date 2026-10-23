import Link from "next/link";
import type { Prisma, Segment, StudentStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { date, fullName, initials } from "@/lib/format";
import { SEGMENTS, SEGMENT_KEYS } from "@/lib/segments";
import { setStudentStatusAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";

const STATUSES: StudentStatus[] = ["PENDING", "ACTIVE", "SUSPENDED"];

export default async function AdminMembers({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; segment?: string }> }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as StudentStatus) ? (sp.status as StudentStatus) : undefined;
  const segment = SEGMENT_KEYS.includes(sp.segment as Segment) ? (sp.segment as Segment) : undefined;
  const q = sp.q?.trim();

  const where: Prisma.UserWhereInput = {
    role: "MEMBER",
    ...(status && { status }),
    ...(segment && { segment }),
    ...(q && {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { matricNo: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    }),
  };

  const [members, bySegment] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 150 }),
    prisma.user.groupBy({ by: ["segment"], where: { role: "MEMBER" }, _count: true }),
  ]);
  const countOf = (k: string) => bySegment.find((b) => b.segment === k)?._count ?? 0;

  return (
    <>
      <PortalHeader title="Congregation members" arabic="الأعضاء" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SEGMENT_KEYS.map((k) => (
          <Link
            key={k}
            href={segment === k ? "/admin/members" : `/admin/members?segment=${k}`}
            className={`card overflow-hidden p-4 transition hover:shadow-lift ${segment === k ? "ring-2 ring-walnut" : ""}`}
          >
            <span className="mb-2 block h-1.5 w-10 rounded-full" style={{ backgroundColor: SEGMENTS[k].color }} />
            <p className="font-display text-3xl font-semibold leading-none">{countOf(k)}</p>
            <p className="mt-1 text-[13px] font-semibold">{SEGMENTS[k].label}</p>
          </Link>
        ))}
      </div>

      <form className="mb-6 grid gap-3 sm:grid-cols-[1fr_170px_200px_auto]">
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input name="q" defaultValue={q} placeholder="Search name, email, member no. or phone" className="input pl-11" />
        </div>
        <select name="status" defaultValue={status ?? ""} className="input">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </select>
        <select name="segment" defaultValue={segment ?? ""} className="input">
          <option value="">All segments</option>
          {SEGMENT_KEYS.map((k) => <option key={k} value={k}>{SEGMENTS[k].label}</option>)}
        </select>
        <button className="btn-primary">Filter</button>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Member</th><th>Member no.</th><th>Segment</th><th>Joined</th><th>Status</th><th>Change status</th></tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const seg = m.segment ? SEGMENTS[m.segment] : null;
              return (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="arch h-11 w-9 shrink-0 overflow-hidden" style={{ backgroundColor: seg?.color ?? "#4A2C1A" }}>
                        {m.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.photo} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full place-items-center text-[12px] font-bold text-gold-light">{initials(m)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{fullName(m)}</p>
                        <p className="text-[12.5px] text-ink-muted">{m.email} · {m.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap font-mono text-[12.5px]">{m.matricNo}</td>
                  <td>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg?.color }} />
                      {seg?.label ?? "—"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-ink-muted">{date(m.createdAt)}</td>
                  <td><StatusBadge status={m.status} /></td>
                  <td>
                    <form action={setStudentStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={m.id} />
                      <select name="status" defaultValue={m.status} className="rounded-lg border border-sand bg-white px-2 py-1.5 text-[13px]">
                        {STATUSES.map((st) => <option key={st} value={st}>{st === "ACTIVE" ? "active (approve)" : st.toLowerCase()}</option>)}
                      </select>
                      <button className="btn-ghost btn-sm !px-3 !py-1.5">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-ink-muted">No members match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-muted">
        Approving a member (status: active) unlocks their ID card. Paying dues marked &ldquo;activates account&rdquo; approves them automatically.{" "}
        <Link href="/admin/members" className="text-walnut hover:underline">Clear filters</Link>
      </p>
    </>
  );
}
