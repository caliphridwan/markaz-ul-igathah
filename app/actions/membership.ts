"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { nextMemberNo } from "@/lib/counters";
import { SEGMENTS, SEGMENT_KEYS } from "@/lib/segments";
import { echo, type FormState } from "./types";

const schema = z
  .object({
    segment: z.enum(SEGMENT_KEYS as [keyof typeof SEGMENTS, ...(keyof typeof SEGMENTS)[]], { message: "Choose your segment" }),
    firstName: z.string().trim().min(2, "Enter your first name").max(60),
    lastName: z.string().trim().min(2, "Enter your surname").max(60),
    otherName: z.string().trim().max(60).optional(),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    phone: z.string().trim().regex(/^\+?[0-9 ]{10,16}$/, "Enter a valid phone number"),
    gender: z.enum(["MALE", "FEMALE"], { message: "Select your gender" }),
    dateOfBirth: z.string().optional(),
    occupation: z.string().trim().max(100).optional(),
    address: z.string().trim().max(200).optional(),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

export async function joinMembershipAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  if (await prisma.user.findUnique({ where: { email: d.email } })) {
    return { values: echo(formData), error: "An account with this email already exists.", fieldErrors: { email: ["Already registered — try logging in"] } };
  }

  const dob = d.dateOfBirth ? new Date(d.dateOfBirth) : null;
  const passwordHash = await bcrypt.hash(d.password, 12);

  const user = await prisma.$transaction(async (tx) =>
    tx.user.create({
      data: {
        role: "MEMBER",
        segment: d.segment,
        matricNo: await nextMemberNo(tx, SEGMENTS[d.segment].code),
        firstName: d.firstName,
        lastName: d.lastName,
        otherName: d.otherName || null,
        email: d.email,
        phone: d.phone,
        gender: d.gender,
        dateOfBirth: dob && !isNaN(dob.getTime()) ? dob : null,
        occupation: d.occupation || null,
        address: d.address || null,
        session: String(new Date().getFullYear()),
        passwordHash,
      },
    }),
  );

  await createSession({ sub: user.id, role: "MEMBER" });
  redirect("/dashboard?welcome=1");
}
