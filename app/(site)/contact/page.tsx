import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const items = [
    { icon: MapPin, label: "Campus", value: site.address },
    { icon: Phone, label: "Phone", value: site.phone },
    { icon: Mail, label: "Email", value: site.email },
    { icon: Clock, label: "Office hours", value: site.hours },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" arabic="اتصل بنا" title="We would be honoured to hear from you." lead="Questions about admissions, fees or programmes? Write to the Registry or visit us on campus." />
      <section className="py-20">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {items.map((i) => (
              <div key={i.label} className="card flex gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-walnut text-gold-light"><i.icon size={20} /></span>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">{i.label}</p>
                  <p className="mt-1 text-[15.5px]">{i.value}</p>
                </div>
              </div>
            ))}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-sand bg-parchment">
              <div className="pattern-ink absolute inset-0 opacity-10" />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <MapPin className="mx-auto text-walnut" size={32} />
                  <p className="mt-2 text-sm text-ink-muted">Embed your Google Maps iframe here</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card p-8 sm:p-10 lg:col-span-7">
            <h2 className="text-3xl">Send a message</h2>
            <p className="mt-2 text-ink-muted">We reply within two working days.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
