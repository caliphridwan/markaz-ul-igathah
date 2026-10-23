import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { fullName } from "@/lib/format";
import { VerifyCard } from "@/components/VerifyCard";

export const metadata: Metadata = { title: "Verify student", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VerifyStudent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.user.findFirst({ where: { id, role: "STUDENT" }, include: { programme: true } });
  if (!s) return <VerifyCard ok={false} title="Record not found" />;
  const valid = s.status === "ACTIVE" || s.status === "GRADUATED";
  return (
    <VerifyCard
      ok={valid}
      title={valid ? "Verified student" : "Not currently active"}
      rows={[
        ["Name", fullName(s)],
        ["Matric no.", s.matricNo ?? "—"],
        ["Programme", s.programme?.title ?? "—"],
        ["Session", s.session ?? "—"],
        ["Status", s.status.charAt(0) + s.status.slice(1).toLowerCase()],
      ]}
    />
  );
}
