import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { isDonationReference, verifyAndFinalize } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Paystack redirects here after checkout (fees and donations). We verify server-side before trusting anything. */
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference") || req.nextUrl.searchParams.get("trxref");
  if (!reference) return NextResponse.redirect(new URL("/dashboard/payments?error=missing", req.url));

  // ---- Donations (no login required) ----
  if (isDonationReference(reference)) {
    const donation = await prisma.donation.findUnique({ where: { reference } });
    if (!donation) return NextResponse.redirect(new URL("/donate?error=unknown", req.url));
    if (donation.status !== "SUCCESS") await verifyAndFinalize(reference);
    const fresh = await prisma.donation.findUnique({ where: { reference } });
    if (fresh?.status === "SUCCESS") return NextResponse.redirect(new URL(`/donate/receipt/${encodeURIComponent(reference)}`, req.url));
    return NextResponse.redirect(new URL("/donate?error=failed", req.url));
  }

  // ---- Fee payments ----
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) return NextResponse.redirect(new URL("/dashboard/payments?error=unknown", req.url));
  if (payment.status !== "SUCCESS") await verifyAndFinalize(reference);

  const fresh = await prisma.payment.findUnique({ where: { reference } });
  if (fresh?.status === "SUCCESS") return NextResponse.redirect(new URL(`/dashboard/receipts/${fresh.id}?paid=1`, req.url));
  return NextResponse.redirect(new URL("/dashboard/payments?error=failed", req.url));
}
