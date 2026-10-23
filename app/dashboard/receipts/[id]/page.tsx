import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { qrDataUrl } from "@/lib/qr";
import { siteUrl } from "@/lib/site";
import { PrintButton } from "@/components/PrintButton";
import { ReceiptDocument } from "@/components/ReceiptDocument";

export default async function ReceiptPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string }> }) {
  const [{ id }, { paid }] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const payment = await prisma.payment.findUnique({ where: { id }, include: { feeItem: true, user: { include: { programme: true } } } });
  if (!payment || payment.status !== "SUCCESS" || !payment.receiptNo) notFound();
  if (payment.userId !== user.id && user.role !== "ADMIN") notFound();

  const verifyUrl = `${siteUrl}/verify/receipt/${encodeURIComponent(payment.receiptNo)}`;
  const qr = await qrDataUrl(verifyUrl);

  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard/receipts" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-walnut">
          <ArrowLeft size={16} /> All receipts
        </Link>
        <PrintButton />
      </div>
      {paid && (
        <p className="no-print mb-6 flex items-center gap-2 rounded-xl border border-jade/25 bg-jade/5 px-4 py-3 text-sm text-jade">
          <CheckCircle2 size={18} /> Payment successful — jazakallahu khairan. Your receipt is below.
        </p>
      )}
      <ReceiptDocument payment={payment} user={payment.user} qr={qr} verifyUrl={verifyUrl} />
    </>
  );
}
