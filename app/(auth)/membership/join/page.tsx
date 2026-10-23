import type { Metadata } from "next";
import Link from "next/link";
import { SEGMENT_KEYS } from "@/lib/segments";
import { JoinForm } from "./JoinForm";

export const metadata: Metadata = { title: "Become a member" };

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ segment?: string }> }) {
  const { segment } = await searchParams;
  const initial = SEGMENT_KEYS.find((k) => k === segment) ?? "MEMBER";
  return (
    <div className="w-full max-w-2xl">
      <span className="eyebrow">Congregation membership</span>
      <h1 className="mt-4 text-[2.8rem] leading-tight">Join the jama&apos;ah.</h1>
      <p className="mt-2 text-ink-muted">Your membership number is issued immediately. Once confirmed, you can print your membership ID card from your portal.</p>
      <JoinForm initialSegment={initial} />
      <p className="mt-8 text-center text-sm text-ink-muted">
        Already a member? <Link href="/login" className="font-semibold text-emerald hover:underline">Log in</Link>
        <span className="mx-2 text-sand-dark">·</span>
        Applying to study? <Link href="/register" className="font-semibold text-emerald hover:underline">Student admission</Link>
      </p>
    </div>
  );
}
