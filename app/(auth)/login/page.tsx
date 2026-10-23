import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_PASSWORD, demoAccounts, isDemoLoginEnabled } from "@/lib/demo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="w-full max-w-md">
      <span className="eyebrow">Student & member portal</span>
      <h1 className="mt-4 text-[2.8rem] leading-tight">Assalamu &apos;alaykum.</h1>
      <p className="mt-2 text-ink-muted">Students and members: log in to view your payments, receipts and ID card.</p>
      <LoginForm next={next} demo={isDemoLoginEnabled() ? { accounts: demoAccounts, password: DEMO_PASSWORD } : null} />
      <p className="mt-8 text-center text-sm text-ink-muted">
        New to the Markaz?{" "}
        <Link href="/register" className="font-semibold text-walnut hover:underline">Apply as a student</Link>
        <span className="mx-2 text-sand-dark">·</span>
        <Link href="/membership/join" className="font-semibold text-walnut hover:underline">Join as a member</Link>
      </p>
    </div>
  );
}
