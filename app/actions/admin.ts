"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { echo, type FormState } from "./types";
import { SEGMENTS, type SegmentKey } from "@/lib/segments";

const statuses = ["PENDING", "ACTIVE", "GRADUATED", "SUSPENDED"] as const;

export async function setStudentStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = z.enum(statuses).safeParse(formData.get("status"));
  if (!id || !status.success) return;
  await prisma.user.update({ where: { id, role: { in: ["STUDENT", "MEMBER"] } }, data: { status: status.data } });
  revalidatePath("/admin", "layout");
}

const feeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(300).optional(),
  amount: z.coerce.number().positive("Enter an amount").max(100_000_000),
  session: z.string().trim().min(4),
  programmeId: z.string().optional(),
  audience: z.enum(["STUDENT", "MEMBER"]).default("STUDENT"),
  segment: z.string().optional(),
  activatesAccount: z.string().optional(),
});

export async function createFeeAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = feeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  await prisma.feeItem.create({
    data: {
      name: d.name,
      description: d.description || null,
      amount: Math.round(d.amount * 100),
      session: d.session,
      audience: d.audience,
      programmeId: d.audience === "STUDENT" ? d.programmeId || null : null,
      segment: d.audience === "MEMBER" && d.segment && d.segment in SEGMENTS ? (d.segment as SegmentKey) : null,
      activatesAccount: d.activatesAccount === "on",
    },
  });
  revalidatePath("/admin/fees");
  return { ok: "Fee item created." };
}

export async function toggleFeeAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const fee = await prisma.feeItem.findUnique({ where: { id } });
  if (!fee) return;
  await prisma.feeItem.update({ where: { id }, data: { active: !fee.active } });
  revalidatePath("/admin/fees");
}

const annSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(5).max(2000),
  pinned: z.string().optional(),
});

export async function createAnnouncementAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = annSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  await prisma.announcement.create({
    data: { title: parsed.data.title, body: parsed.data.body, pinned: parsed.data.pinned === "on" },
  });
  revalidatePath("/", "layout");
  return { ok: "Announcement published." };
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await prisma.announcement.delete({ where: { id } }).catch(() => null);
  revalidatePath("/", "layout");
}

export async function toggleMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const m = await prisma.contactMessage.findUnique({ where: { id } });
  if (!m) return;
  await prisma.contactMessage.update({ where: { id }, data: { read: !m.read } });
  revalidatePath("/admin/messages");
}

const causeSchema = z.object({
  title: z.string().trim().min(3).max(120),
  arabicTitle: z.string().trim().max(120).optional(),
  summary: z.string().trim().min(10, "Add a short description").max(500),
  goal: z.string().optional(),
});

export async function createCauseAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = causeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  const goal = d.goal ? Math.round(Number(d.goal) * 100) : null;
  if (goal !== null && (!Number.isFinite(goal) || goal <= 0)) return { values: echo(formData), fieldErrors: { goal: ["Enter a valid goal or leave it empty"] } };
  const base = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cause";
  const slug = (await prisma.donationCause.findUnique({ where: { slug: base } })) ? `${base}-${Date.now().toString(36)}` : base;
  const order = (await prisma.donationCause.count()) + 1;
  await prisma.donationCause.create({ data: { title: d.title, arabicTitle: d.arabicTitle || null, summary: d.summary, goal, slug, order } });
  revalidatePath("/admin/donations");
  revalidatePath("/donate");
  return { ok: "Cause created." };
}

export async function toggleCauseAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const c = await prisma.donationCause.findUnique({ where: { id } });
  if (!c) return;
  await prisma.donationCause.update({ where: { id }, data: { active: !c.active } });
  revalidatePath("/admin/donations");
  revalidatePath("/donate");
}
