import Link from "next/link";
import type { Prisma, StudentStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { date, fullName, initials } from "@/lib/format";
import { setStudentStatusAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";

const STATUSES: StudentStatus[] = ["PENDING", "ACTIVE", "GRADUATED", "SUSPENDED"];

export default async function AdminStudents({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; programme?: string }> }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as StudentStatus) ? (sp.status as StudentStatus) : undefined;
  const q = sp.q?.trim();

  const where: Prisma.UserWhereInput = {
    role: "STUDENT",
    ...(status && { status }),
    ...(sp.programme && { programmeId: sp.programme }),
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

  const [students, programmes] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { programme: true } }),
    prisma.programme.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PortalHeader title="Students" arabic="الطلاب" />
      <form className="mb-6 grid gap-3 sm:grid-cols-[1fr_180px_220px_auto]">
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input name="q" defaultValue={q} placeholder="Search name, email, matric or phone" className="input pl-11" />
        </div>
        <select name="status" defaultValue={status ?? ""} className="input">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
        </select>
        <select name="programme" defaultValue={sp.programme ?? ""} className="input">
          <option value="">All programmes</option>
          {programmes.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <button className="btn-primary">Filter</button>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Student</th><th>Matric</th><th>Programme</th><th>Registered</th><th>Status</th><th>Change status</th></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="arch h-11 w-9 shrink-0 overflow-hidden bg-emerald">
                      {s.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-[12px] font-bold text-gold-light">{initials(s)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{fullName(s)}</p>
                      <p className="text-[12.5px] text-ink-muted">{s.email} · {s.phone}</p>
                      {s.entryType === "ALUMNUS" && <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">Alumni applicant</span>}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap font-mono text-[12.5px]">{s.matricNo}</td>
                <td>{s.programme?.title ?? "—"}</td>
                <td className="whitespace-nowrap text-ink-muted">{date(s.createdAt)}</td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  <form action={setStudentStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <select name="status" defaultValue={s.status} className="rounded-lg border border-sand bg-white px-2 py-1.5 text-[13px]">
                      {STATUSES.map((st) => <option key={st} value={st}>{st.toLowerCase()}</option>)}
                    </select>
                    <button className="btn-ghost btn-sm !px-3 !py-1.5">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-ink-muted">No students match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-muted">Showing up to 100 students. <Link href="/admin/students" className="text-emerald hover:underline">Clear filters</Link></p>
    </>
  );
}
