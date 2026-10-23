import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { qrDataUrl } from "@/lib/qr";
import { siteUrl } from "@/lib/site";
import { PrintButton } from "@/components/PrintButton";
import { DonationReceipt } from "@/components/DonationReceipt";

export const metadata: Metadata = { title: "Donation receipt", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Reachable only by the long random payment reference, so donors without accounts can return to their receipt. */
export default async function DonationReceiptPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const donation = await prisma.donation.findUnique({ where: { reference: decodeURIComponent(reference) }, include: { cause: true } });
  if (!donation) notFound();

  if (donation.status !== "SUCCESS" || !donation.receiptNo) {
    return (
      <section className="py-24">
        <div className="container max-w-xl text-center">
          <Clock size={40} className="mx-auto text-gold" />
          <h1 className="mt-4 text-4xl">{donation.status === "FAILED" ? "Donation not completed" : "Confirming your donation…"}</h1>
          <p className="mt-3 text-ink-muted">
            {donation.status === "FAILED"
              ? "Nothing was charged. You can try again."
              : "Your payment is being confirmed. Refresh this page in a moment."}
          </p>
          <Link href="/donate" className="btn-primary mt-8">Back to donations</Link>
        </div>
      </section>
    );
  }

  const verifyUrl = `${siteUrl}/verify/donation/${encodeURIComponent(donation.receiptNo)}`;
  const qr = await qrDataUrl(verifyUrl);

  return (
    <section className="bg-parchment/60 py-14 print:bg-white print:py-0">
      <div className="container">
        <div className="no-print mx-auto mb-6 flex max-w-[760px] flex-wrap items-center justify-between gap-4">
          <Link href="/donate" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-walnut">
            <ArrowLeft size={16} /> Donate again
          </Link>
          <PrintButton label="Print / Save receipt" />
        </div>
        <p className="no-print mx-auto mb-6 flex max-w-[760px] items-center gap-2 rounded-xl border border-jade/25 bg-jade/5 px-4 py-3 text-sm text-jade">
          <CheckCircle2 size={18} className="shrink-0" /> Thank you! Your donation was received. Bookmark this page to find your receipt again.
        </p>
        <DonationReceipt donation={donation} qr={qr} verifyUrl={verifyUrl} />
      </div>
    </section>
  );
}
