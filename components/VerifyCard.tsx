import { BadgeCheck, ShieldAlert } from "lucide-react";
import { Crest } from "./Crest";

export function VerifyCard({ ok, title, rows }: { ok: boolean; title: string; rows?: [string, string][] }) {
  return (
    <section className="relative overflow-hidden bg-parchment py-20">
      <div className="pattern-ink absolute inset-0 opacity-[0.04]" />
      <div className="container relative max-w-xl">
        <div className="card overflow-hidden">
          <div className={`flex items-center gap-4 px-8 py-6 ${ok ? "bg-walnut text-ivory" : "bg-red-700 text-white"}`}>
            {ok ? <BadgeCheck size={36} className="text-gold-light" /> : <ShieldAlert size={36} />}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-80">Markaz-ul-Igathah verification</p>
              <h1 className="font-display text-3xl !text-inherit">{title}</h1>
            </div>
          </div>
          {rows && (
            <dl className="divide-y divide-sand px-8 py-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5 text-[15px]">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="flex items-center gap-3 border-t border-sand bg-parchment/60 px-8 py-4 text-[13px] text-ink-muted">
            <Crest size={26} />
            {ok ? "This record exists in the official registry of the Markaz." : "No matching record was found. The document may be invalid."}
          </div>
        </div>
      </div>
    </section>
  );
}
