import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { finalizePayment, paystackVerify } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Paystack redirects here after checkout. We verify server-side before trusting anything. */
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference") || req.nextUrl.searchParams.get("trxref");
  if (!reference) return NextResponse.redirect(new URL("/dashboard/payments?error=missing", req.url));

  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) return NextResponse.redirect(new URL("/dashboard/payments?error=unknown", req.url));

  if (payment.status !== "SUCCESS") {
    const data = await paystackVerify(reference);
    if (data) {
      await finalizePayment(reference, {
        success: data.status === "success",
        paidAmount: data.amount,
        channel: data.channel,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
      });
    }
  }

  const fresh = await prisma.payment.findUnique({ where: { reference } });
  if (fresh?.status === "SUCCESS") return NextResponse.redirect(new URL(`/dashboard/receipts/${fresh.id}?paid=1`, req.url));
  return NextResponse.redirect(new URL("/dashboard/payments?error=failed", req.url));
}
