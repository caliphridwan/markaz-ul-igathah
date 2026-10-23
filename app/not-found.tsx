import Link from "next/link";
import { Crest } from "@/components/Crest";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-parchment px-6 text-center">
      <div className="pattern-ink absolute inset-0 opacity-[0.05]" />
      <div className="relative">
        <Crest size={72} className="mx-auto" />
        <p lang="ar" dir="rtl" className="mt-6 font-ruqaa text-4xl text-walnut">الصفحة غير موجودة</p>
        <h1 className="mt-3 text-5xl">Page not found</h1>
        <p className="mt-3 text-ink-muted">The page you are looking for has moved or never existed.</p>
        <Link href="/" className="btn-primary mt-8">Return home</Link>
      </div>
    </main>
  );
}
