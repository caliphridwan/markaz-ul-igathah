"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({
  links,
  loggedIn,
  portalHref,
}: {
  links: { href: string; label: string }[];
  loggedIn: boolean;
  portalHref: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center rounded-full border border-sand text-ink"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-sand bg-ivory shadow-lift">
          <nav className="container flex flex-col py-4" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-sand/60 py-3.5 font-display text-xl font-semibold">
                {l.label}
              </Link>
            ))}
            <Link href="/donate" className="btn-gold mt-5">
              Donate to the Markaz
            </Link>
            <div className="mt-3 flex gap-3">
              {loggedIn ? (
                <Link href={portalHref} className="btn-primary flex-1">
                  My portal
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost flex-1">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary flex-1">
                    Apply now
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
