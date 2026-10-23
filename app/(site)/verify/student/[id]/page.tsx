import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { fullName } from "@/lib/format";
import { VerifyCard } from "@/components/VerifyCard";
import { segmentLabel } from "@/lib/segments";

export const metadata: Metadata = { title: "Verify student", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VerifyStudent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.user.findFirst({ where: { id, role: { in: ["STUDENT", "MEMBER"] } }, include: { programme: true } });
  if (!s) return <VerifyCard ok={false} title="Record not found" />;
  const valid = s.status === "ACTIVE" || s.status === "GRADUATED";
  const isMember = s.role === "MEMBER";
  return (
    <VerifyCard
      ok={valid}
      title={valid ? (isMember ? "Verified member" : "Verified student") : "Not currently active"}
      rows={[
        ["Name", fullName(s)],
        [isMember ? "Membership no." : "Matric no.", s.matricNo ?? "—"],
        isMember ? ["Segment", segmentLabel(s.segment)] : ["Programme", s.programme?.title ?? "—"],
        [isMember ? "Member since" : "Session", s.session ?? "—"],
        ["Status", s.status.charAt(0) + s.status.slice(1).toLowerCase()],
      ]}
    />
  );
}
