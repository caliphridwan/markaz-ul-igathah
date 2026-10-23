import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { date, money } from "@/lib/format";
import { VerifyCard } from "@/components/VerifyCard";

export const metadata: Metadata = { title: "Verify donation", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VerifyDonation({ params }: { params: Promise<{ receiptNo: string }> }) {
  const { receiptNo } = await params;
  const d = await prisma.donation.findUnique({ where: { receiptNo: decodeURIComponent(receiptNo) }, include: { cause: true } });
  if (!d || d.status !== "SUCCESS") return <VerifyCard ok={false} title="Receipt not found" />;
  return (
    <VerifyCard
      ok
      title="Genuine donation receipt"
      rows={[
        ["Receipt no.", d.receiptNo ?? ""],
        ["Donor", d.anonymous ? "Anonymous" : d.donorName],
        ["Cause", d.cause?.title ?? "General Fund"],
        ["Amount", money(d.amount)],
        ["Date", date(d.paidAt, { dateStyle: "long" })],
      ]}
    />
  );
}
