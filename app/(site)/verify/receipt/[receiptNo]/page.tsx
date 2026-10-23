import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { date, fullName, money } from "@/lib/format";
import { VerifyCard } from "@/components/VerifyCard";

export const metadata: Metadata = { title: "Verify receipt", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VerifyReceipt({ params }: { params: Promise<{ receiptNo: string }> }) {
  const { receiptNo } = await params;
  const p = await prisma.payment.findUnique({ where: { receiptNo: decodeURIComponent(receiptNo) }, include: { user: true } });
  if (!p || p.status !== "SUCCESS") return <VerifyCard ok={false} title="Receipt not found" />;
  return (
    <VerifyCard
      ok
      title="Genuine receipt"
      rows={[
        ["Receipt no.", p.receiptNo ?? ""],
        ["Paid by", fullName(p.user)],
        ["Matric no.", p.user.matricNo ?? "—"],
        ["For", p.purpose],
        ["Amount", money(p.amount)],
        ["Date", date(p.paidAt, { dateStyle: "long" })],
      ]}
    />
  );
}
