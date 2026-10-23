import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Wordmark } from "./Crest";
import { MobileNav } from "./MobileNav";

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/programmes", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  { href: "/membership", label: "Membership" },
  { href: "/alumni", label: "Alumni" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const session = await getSession();
  const portalHref = session?.role === "ADMIN" ? "/admin" : "/dashboard";
  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-ivory/85 backdrop-blur-md">
      <div className="hidden border-b border-sand/60 bg-emerald-900 text-[12.5px] text-ivory/70 md:block">
        <div className="container flex h-9 items-center justify-between">
          <span>
            Admissions open for the <span className="text-gold-light">2026/2027</span> session
          </span>
          <span lang="ar" dir="rtl" className="font-arabic text-[14px] text-gold-light/90">
            ﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾
          </span>
        </div>
      </div>
      <div className="container flex h-[74px] items-center justify-between gap-6">
        <Link href="/" aria-label="Markaz-ul-Igathah — home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] font-semibold text-ink-soft transition hover:text-emerald">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <Link href={portalHref} className="btn-primary btn-sm">
              My portal
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[14px] font-semibold text-ink-soft hover:text-emerald">
                Log in
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                Apply now
              </Link>
            </>
          )}
        </div>
        <MobileNav links={navLinks} loggedIn={!!session} portalHref={portalHref} />
      </div>
    </header>
  );
}
