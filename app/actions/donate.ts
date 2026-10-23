"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { DONATION_PREFIX, finalizeDonation, isDemoMode, newReference, paystackInitialize, paystackKey } from "@/lib/payments";
import { echo, type FormState } from "./types";

const MIN = 100; // ₦
const MAX = 10_000_000; // ₦

const schema = z.object({
  causeId: z.string().optional(),
  amount: z.coerce
    .number({ invalid_type_error: "Enter an amount" })
    .min(MIN, `The minimum donation is ₦${MIN.toLocaleString()}`)
    .max(MAX, "For large gifts, please contact the Registry or use bank transfer"),
  donorName: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email — your receipt is sent here"),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().max(300).optional(),
  anonymous: z.string().optional(),
});

export async function donateAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  const cause = d.causeId ? await prisma.donationCause.findFirst({ where: { id: d.causeId, active: true } }) : null;
  const session = await getSession();
  const amount = Math.round(d.amount * 100); // kobo
  const reference = newReference(DONATION_PREFIX);

  await prisma.donation.create({
    data: {
      causeId: cause?.id ?? null,
      userId: session?.sub ?? null,
      donorName: d.donorName,
      email: d.email,
      phone: d.phone || null,
      message: d.message || null,
      anonymous: d.anonymous === "on",
      amount,
      reference,
    },
  });

  if (isDemoMode()) {
    await finalizeDonation(reference, { success: true, paidAmount: amount, channel: "demo" });
    revalidatePath("/donate");
    redirect(`/donate/receipt/${encodeURIComponent(reference)}`);
  }

  if (!paystackKey()) return { values: echo(formData), error: "Online giving is not configured yet. Please use the bank transfer details below." };

  let url: string;
  try {
    url = await paystackInitialize({
      email: d.email,
      amount,
      reference,
      metadata: { type: "donation", cause: cause?.title ?? "General Fund", donorName: d.donorName },
    });
  } catch {
    await prisma.donation.update({ where: { reference }, data: { status: "FAILED" } });
    return { values: echo(formData), error: "We couldn't reach the payment gateway. Please try again in a moment." };
  }
  redirect(url);
}
