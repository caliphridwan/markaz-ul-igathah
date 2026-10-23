"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { feeScope } from "@/lib/fees";
import { finalizePayment, isDemoMode, newReference, paystackInitialize, paystackKey } from "@/lib/payments";
import { echo, type FormState } from "./types";

const opt = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => (v ? v : null));

const profileSchema = z.object({
  phone: z.string().trim().regex(/^\+?[0-9 ]{10,16}$/, "Enter a valid phone number"),
  arabicName: opt,
  address: opt,
  stateOfOrigin: opt,
  guardianName: opt,
  guardianPhone: opt,
  occupation: opt,
  dateOfBirth: z.string().optional(),
});

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { dateOfBirth, ...rest } = parsed.data;
  const dob = dateOfBirth ? new Date(dateOfBirth) : null;
  await prisma.user.update({
    where: { id: user.id },
    data: { ...rest, dateOfBirth: dob && !isNaN(dob.getTime()) ? dob : user.dateOfBirth },
  });
  revalidatePath("/dashboard", "layout");
  return { ok: "Profile updated." };
}

export async function updatePhotoAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const photo = String(formData.get("photo") || "");
  if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo)) return { values: echo(formData), error: "Please choose a valid image." };
  if (photo.length > 220_000) return { values: echo(formData), error: "Image is too large. Please use a smaller photo." };
  await prisma.user.update({ where: { id: user.id }, data: { photo } });
  revalidatePath("/dashboard", "layout");
  return { ok: "Passport photo saved." };
}

const passwordSchema = z
  .object({ current: z.string().min(1), password: z.string().min(8, "Use at least 8 characters"), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { values: echo(formData), fieldErrors: { current: ["Current password is incorrect"] } };
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } });
  return { ok: "Password changed." };
}

const alumniSchema = z.object({
  graduationYear: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  occupation: opt,
  location: opt,
  bio: z.string().trim().max(600).optional().transform((v) => v || null),
  linkedin: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .refine((v) => !v || /^https?:\/\//.test(v), "Must start with http:// or https://"),
  visible: z.string().optional().transform((v) => v === "on"),
});

export async function saveAlumniAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  if (user.status !== "GRADUATED") return { values: echo(formData), error: "The alumni profile opens once the Registry confirms your graduation." };
  const parsed = alumniSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  await prisma.alumniProfile.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: { ...parsed.data, userId: user.id },
  });
  revalidatePath("/dashboard/alumni");
  revalidatePath("/alumni");
  return { ok: "Alumni profile saved. Jazakallahu khairan!" };
}

/** Start payment for a fee item. Amount always comes from the database. */
export async function startPaymentAction(formData: FormData) {
  const user = await requireUser();
  const feeItemId = String(formData.get("feeItemId") || "");
  const fee = await prisma.feeItem.findFirst({ where: { AND: [{ id: feeItemId }, feeScope(user)] } });
  if (!fee) redirect("/dashboard/payments?error=invalid");

  const alreadyPaid = await prisma.payment.findFirst({ where: { userId: user.id, feeItemId: fee.id, status: "SUCCESS" } });
  if (alreadyPaid) redirect(`/dashboard/receipts/${alreadyPaid.id}`);

  const reference = newReference();
  const payment = await prisma.payment.create({
    data: { userId: user.id, feeItemId: fee.id, purpose: fee.name, amount: fee.amount, reference },
  });

  if (isDemoMode()) {
    await finalizePayment(reference, { success: true, paidAmount: fee.amount, channel: "demo" });
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/receipts/${payment.id}?paid=1`);
  }

  if (!paystackKey()) redirect("/dashboard/payments?error=config");

  let url: string;
  try {
    url = await paystackInitialize({
      email: user.email,
      amount: fee.amount,
      reference,
      metadata: { userId: user.id, feeItemId: fee.id, idNumber: user.matricNo, role: user.role },
    });
  } catch {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    redirect("/dashboard/payments?error=gateway");
  }
  redirect(url);
}
