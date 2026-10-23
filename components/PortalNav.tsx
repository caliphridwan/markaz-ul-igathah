"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  IdCard,
  GraduationCap,
  UserRound,
  Users,
  Wallet,
  Megaphone,
  Inbox,
  Menu,
  X,
  LogOut,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Wordmark } from "./Crest";

const icons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  payments: CreditCard,
  receipts: Receipt,
  idcard: IdCard,
  alumni: GraduationCap,
  profile: UserRound,
  students: Users,
  fees: Wallet,
  announcements: Megaphone,
  messages: Inbox,
};

export type NavItem = { href: string; label: string; icon: keyof typeof icons; badge?: number };

export function PortalNav({ items, user }: { items: NavItem[]; user: { name: string; sub: string; photo?: string | null; initials: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const root = items[0]?.href;
  const isActive = (href: string) => (href === root ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <Link href="/"><Wordmark tone="light" /></Link>
      </div>
      <div className="mx-4 mb-5 flex items-center gap-3 rounded-2xl border border-ivory/10 bg-ivory/5 p-3">
        <div className="arch h-12 w-10 shrink-0 overflow-hidden bg-gold/20">
          {user.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center font-display text-lg text-gold-light">{user.initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-ivory">{user.name}</p>
          <p className="truncate text-[12px] text-ivory/55">{user.sub}</p>
        </div>
      </div>
      <ul className="flex-1 space-y-1 px-3">
        {items.map((i) => {
          const Icon = icons[i.icon];
          const active = isActive(i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition ${
                  active ? "bg-gold text-ink shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]" : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{i.label}</span>
                {!!i.badge && <span className={`rounded-full px-2 text-[11px] ${active ? "bg-ink/15" : "bg-gold/20 text-gold-light"}`}>{i.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-ivory/10 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-ivory/60 hover:bg-ivory/5 hover:text-ivory">
          <Globe size={18} /> Visit website
        </Link>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-ivory/60 hover:bg-ivory/5 hover:text-ivory">
            <LogOut size={18} /> Log out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[272px] overflow-y-auto bg-emerald-900 lg:block">
        <div className="pattern-gold pointer-events-none absolute inset-0 opacity-[0.04]" />
        <div className="relative h-full">{nav}</div>
      </aside>

      <div className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ivory/10 bg-emerald-900 px-4 lg:hidden">
        <Link href="/"><Wordmark tone="light" /></Link>
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-ivory/20 text-ivory" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-[284px] overflow-y-auto bg-emerald-900 shadow-lift">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ivory/70" aria-label="Close menu">
              <X size={18} />
            </button>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}

export function PortalHeader({ title, arabic, children }: { title: string; arabic?: string; children?: React.ReactNode }) {
  return (
    <div className="no-print mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {arabic && (
          <p lang="ar" dir="rtl" className="font-arabic text-lg text-gold-dark">
            {arabic}
          </p>
        )}
        <h1 className="text-[2.3rem] leading-tight">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
