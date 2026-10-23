import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { Wordmark } from "./Crest";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-emerald-900 text-ivory/75">
      <div className="pattern-gold pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="container relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-ivory/65">{site.description}</p>
          <p lang="ar" dir="rtl" className="mt-6 font-ruqaa text-2xl text-gold-light/90">
            طلب العلم فريضة على كل مسلم
          </p>
        </div>
        <div className="md:col-span-3">
          <h3 className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-gold-light">Explore</h3>
          <ul className="mt-5 space-y-3 text-[14.5px]">
            {[
              ["/about", "About the Markaz"],
              ["/programmes", "Programmes"],
              ["/admissions", "Admissions & fees"],
              ["/membership", "Congregation membership"],
              ["/alumni", "Alumni network"],
              ["/register", "Apply online"],
              ["/login", "Student portal"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-gold-light">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-gold-light">Visit & contact</h3>
          <ul className="mt-5 space-y-4 text-[14.5px]">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-gold" />{site.address}</li>
            <li className="flex gap-3"><Phone size={18} className="mt-0.5 shrink-0 text-gold" />{site.phone}</li>
            <li className="flex gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-gold" />{site.email}</li>
            <li className="flex gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-gold" />{site.hours}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-ivory/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-[12.5px] text-ivory/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Established {site.founded} · Knowledge · Character · Service</span>
        </div>
      </div>
    </footer>
  );
}
