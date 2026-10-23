import Link from "next/link";
import { Wordmark } from "@/components/Crest";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-walnut-900 text-ivory lg:block">
        <div className="pattern-gold absolute inset-0 opacity-[0.09]" />
        <div className="absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full border border-gold/15" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/"><Wordmark tone="light" /></Link>
          <div>
            <div className="arch mx-auto w-[300px] border border-gold/40 p-3">
              <div className="arch relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-b from-walnut to-walnut-800">
                <div className="pattern-gold absolute inset-0 opacity-20" />
                <p lang="ar" dir="rtl" className="relative font-ruqaa text-6xl leading-tight text-gold-light">
                  طلب
                  <br />
                  العلم
                </p>
              </div>
            </div>
            <p className="mx-auto mt-10 max-w-md text-center font-display text-2xl italic leading-snug text-ivory/85">
              &ldquo;Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.&rdquo;
            </p>
            <p className="mt-3 text-center text-[13px] uppercase tracking-[0.2em] text-gold-light/80">Sahih Muslim</p>
          </div>
          <p className="text-[13px] text-ivory/50">© {new Date().getFullYear()} Markaz-ul-Igathah</p>
        </div>
      </aside>
      <main className="relative flex flex-col bg-ivory">
        <div className="pattern-ink pointer-events-none absolute inset-0 opacity-[0.03]" />
        <div className="relative flex items-center justify-between p-6 lg:hidden">
          <Link href="/"><Wordmark /></Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10">{children}</div>
      </main>
    </div>
  );
}
