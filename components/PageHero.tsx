export function PageHero({ eyebrow, arabic, title, lead }: { eyebrow: string; arabic: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="relative overflow-hidden bg-emerald-800 text-ivory">
      <div className="pattern-gold absolute inset-0 opacity-[0.07]" />
      <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-gold/15" />
      <div className="absolute -right-10 -top-10 h-[300px] w-[300px] rounded-full border border-gold/10" />
      <div className="container relative py-20 sm:py-24">
        <div className="reveal max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="eyebrow !text-gold-light">{eyebrow}</span>
            <span lang="ar" dir="rtl" className="font-arabic text-lg text-gold-light/80">
              {arabic}
            </span>
          </div>
          <h1 className="display mt-5 !text-ivory">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-[17.5px] leading-relaxed text-ivory/75">{lead}</p>}
        </div>
      </div>
      <div className="gold-rule relative" />
    </section>
  );
}
