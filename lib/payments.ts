import "server-only";
import { prisma } from "./db";
import { nextReceiptNo } from "./counters";
import { siteUrl } from "./site";

const PAYSTACK = "https://api.paystack.co";

export function paystackKey() {
  return process.env.PAYSTACK_SECRET_KEY?.trim() || "";
}

/** Demo mode: only when no Paystack key is configured AND explicitly enabled. */
export function isDemoMode() {
  return !paystackKey() && process.env.PAYMENTS_DEMO_MODE === "true";
}

export function newReference() {
  const rand = crypto.getRandomValues(new Uint8Array(6));
  const hex = Array.from(rand, (b) => b.toString(16).padStart(2, "0")).join("");
  return `MUI-${Date.now().toString(36).toUpperCase()}-${hex.toUpperCase()}`;
}

export async function paystackInitialize(opts: { email: string; amount: number; reference: string; metadata?: unknown }) {
  const res = await fetch(`${PAYSTACK}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${paystackKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amount,
      reference: opts.reference,
      currency: "NGN",
      callback_url: `${siteUrl}/api/payments/callback`,
      metadata: opts.metadata,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as { status: boolean; message: string; data?: { authorization_url: string } };
  if (!res.ok || !json.status || !json.data) throw new Error(json.message || "Could not start payment");
  return json.data.authorization_url;
}

type VerifyData = { status: string; amount: number; channel?: string; paid_at?: string; reference: string };

export async function paystackVerify(reference: string): Promise<VerifyData | null> {
  const res = await fetch(`${PAYSTACK}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${paystackKey()}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { status: boolean; data?: VerifyData };
  return json.status && json.data ? json.data : null;
}

/**
 * Mark a payment successful (idempotent). Issues a receipt number and, if the
 * fee item activates accounts, moves a PENDING student to ACTIVE.
 * `paidAmount` must equal the stored amount or the payment is marked FAILED.
 */
export async function finalizePayment(reference: string, result: { success: boolean; paidAmount: number; channel?: string; paidAt?: Date }) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { reference }, include: { feeItem: true, user: true } });
    if (!payment) return null;
    if (payment.status === "SUCCESS") return payment;

    if (!result.success || result.paidAmount !== payment.amount) {
      return tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" }, include: { feeItem: true, user: true } });
    }

    const receiptNo = await nextReceiptNo(tx);
    // Conditional update guards against the callback and webhook racing each other.
    const res = await tx.payment.updateMany({
      where: { id: payment.id, status: { not: "SUCCESS" } },
      data: { status: "SUCCESS", receiptNo, channel: result.channel ?? null, paidAt: result.paidAt ?? new Date() },
    });
    const updated = await tx.payment.findUniqueOrThrow({ where: { id: payment.id }, include: { feeItem: true, user: true } });
    if (res.count === 0) return updated;

    if (payment.feeItem?.activatesAccount && payment.user.status === "PENDING" && (payment.user.role === "MEMBER" || payment.user.entryType === "NEW_STUDENT")) {
      await tx.user.update({ where: { id: payment.userId }, data: { status: "ACTIVE" } });
    }
    return updated;
  });
}
