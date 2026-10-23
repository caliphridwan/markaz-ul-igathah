import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Apply" };
export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ programme?: string; entry?: string }> }) {
  const sp = await searchParams;
  const programmes = await prisma.programme.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } });
  return (
    <div className="w-full max-w-2xl">
      <span className="eyebrow">Admissions · 2026/2027</span>
      <h1 className="mt-4 text-[2.8rem] leading-tight">Begin your application.</h1>
      <p className="mt-2 text-ink-muted">Your matric number is issued the moment you register. You can complete the rest of your profile in the portal.</p>
      <RegisterForm
        programmes={programmes.map((p) => ({ value: p.id, label: p.title }))}
        defaultProgramme={sp.programme}
        defaultEntry={sp.entry === "ALUMNUS" ? "ALUMNUS" : "NEW_STUDENT"}
      />
      <p className="mt-8 text-center text-sm text-ink-muted">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-walnut hover:underline">Log in</Link>
        <span className="mx-2 text-sand-dark">·</span>
        Member of the masjid?{" "}
        <Link href="/membership/join" className="font-semibold text-walnut hover:underline">Join as a member</Link>
      </p>
    </div>
  );
}
