import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { paystackKey, verifyAndFinalize } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Paystack webhook (fees and donations): set {SITE_URL}/api/payments/webhook in your Paystack dashboard. */
export async function POST(req: NextRequest) {
  const key = paystackKey();
  if (!key) return NextResponse.json({ ok: false }, { status: 400 });

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const expected = createHmac("sha512", key).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ ok: false }, { status: 401 });

  const event = JSON.parse(raw) as { event: string; data?: { reference?: string } };
  if (event.event === "charge.success" && event.data?.reference) {
    // Re-verify with Paystack rather than trusting the payload amount.
    await verifyAndFinalize(event.data.reference);
  }
  return NextResponse.json({ ok: true });
}
