import Link from "next/link";
import { GraduationCap, Hourglass } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PortalHeader } from "@/components/PortalNav";
import { AlumniForm } from "./AlumniForm";

export default async function DashboardAlumni() {
  const user = await requireUser();
  const profile = await prisma.alumniProfile.findUnique({ where: { userId: user.id } });
  const count = await prisma.alumniProfile.count({ where: { visible: true } });

  if (user.status !== "GRADUATED") {
    const pendingAlumnus = user.entryType === "ALUMNUS";
    return (
      <>
        <PortalHeader title="Alumni" arabic="الخريجون" />
        <div className="card relative max-w-2xl overflow-hidden p-8">
          <div className="pattern-ink absolute inset-0 opacity-[0.03]" />
          <div className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-parchment text-emerald">
              {pendingAlumnus ? <Hourglass size={22} /> : <GraduationCap size={22} />}
            </span>
            <h2 className="mt-5 text-3xl">{pendingAlumnus ? "Confirming your record" : "The alumni network awaits you"}</h2>
            <p className="mt-3 text-ink-muted">
              {pendingAlumnus
                ? "Thank you for reconnecting. The Registry is confirming your graduation record. Once confirmed, you can create your alumni profile and appear on the alumni wall."
                : "When you graduate, your account becomes an alumni account. You'll be able to create a public profile, reconnect with classmates and mentor new students."}
            </p>
            <p className="mt-6 text-sm text-ink-muted">{count} alumni have already joined.</p>
            <Link href="/alumni" className="btn-ghost btn-sm mt-4">View alumni wall</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PortalHeader title="Alumni profile" arabic="ملف الخريج">
        <Link href="/alumni" className="btn-ghost btn-sm">View alumni wall</Link>
      </PortalHeader>
      <div className="card max-w-3xl p-6 sm:p-8">
        <p className="text-ink-muted">Mabruk on completing your studies! Share a little about where life has taken you.</p>
        <AlumniForm
          defaults={{
            graduationYear: String(profile?.graduationYear ?? new Date().getFullYear()),
            occupation: profile?.occupation ?? "",
            location: profile?.location ?? "",
            linkedin: profile?.linkedin ?? "",
            bio: profile?.bio ?? "",
          }}
          visible={profile?.visible ?? true}
        />
      </div>
    </>
  );
}
