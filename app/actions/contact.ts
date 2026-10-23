"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { echo, type FormState } from "./types";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2, "Add a subject").max(140),
  message: z.string().trim().min(10, "Please write a little more").max(3000),
  website: z.string().optional(), // honeypot
});

export async function contactAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { values: echo(formData), error: "Please check the form.", fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.website) return { ok: "Thank you — your message has been received." };
  const { website: _w, ...data } = parsed.data;
  await prisma.contactMessage.create({ data: { ...data, phone: data.phone || null } });
  return { ok: "Thank you — your message has been received. The Registry will reply within two working days, in sha Allah." };
}
