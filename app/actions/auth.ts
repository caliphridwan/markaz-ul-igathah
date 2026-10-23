"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { nextMatricNo } from "@/lib/counters";
import { site } from "@/lib/site";
import { echo, type FormState } from "./types";

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Enter your first name").max(60),
    lastName: z.string().trim().min(2, "Enter your surname").max(60),
    otherName: z.string().trim().max(60).optional(),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    phone: z.string().trim().regex(/^\+?[0-9 ]{10,16}$/, "Enter a valid phone number"),
    gender: z.enum(["MALE", "FEMALE"], { message: "Select your gender" }),
    dateOfBirth: z.string().optional(),
    programmeId: z.string().min(1, "Choose a programme"),
    entryType: z.enum(["NEW_STUDENT", "ALUMNUS"]),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  if (await prisma.user.findUnique({ where: { email: d.email } })) {
    return { values: echo(formData), error: "An account with this email already exists.", fieldErrors: { email: ["Already registered — try logging in"] } };
  }
  const programme = await prisma.programme.findUnique({ where: { id: d.programmeId } });
  if (!programme) return { values: echo(formData), fieldErrors: { programmeId: ["Choose a valid programme"] } };

  const dob = d.dateOfBirth ? new Date(d.dateOfBirth) : null;
  const passwordHash = await bcrypt.hash(d.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const matricNo = await nextMatricNo(tx);
    return tx.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        otherName: d.otherName || null,
        email: d.email,
        phone: d.phone,
        gender: d.gender,
        dateOfBirth: dob && !isNaN(dob.getTime()) ? dob : null,
        programmeId: programme.id,
        entryType: d.entryType,
        passwordHash,
        matricNo,
        session: site.currentSession,
      },
    });
  });

  await createSession({ sub: user.id, role: "STUDENT" });
  redirect("/dashboard?welcome=1");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Enter your email and password." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) return { values: echo(formData), error: "Incorrect email or password." };
  if (user.status === "SUSPENDED") return { values: echo(formData), error: "This account is suspended. Please contact the Registry." };

  await createSession({ sub: user.id, role: user.role });

  const next = parsed.data.next;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  if (user.role === "ADMIN") redirect(safeNext?.startsWith("/admin") ? safeNext : "/admin");
  redirect(safeNext?.startsWith("/dashboard") ? safeNext : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
