export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="18" height="18" viewBox="0 0 20 20">
        <path d="M10 1 12.4 7.6 19 10 12.4 12.4 10 19 7.6 12.4 1 10 7.6 7.6Z" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

/** Bilingual section heading: small-caps English eyebrow + Arabic word, then a display title. */
export function SectionHeading({
  eyebrow,
  arabic,
  title,
  lead,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  arabic?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      <div className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span className={`eyebrow ${light ? "!text-gold-light" : ""}`}>{eyebrow}</span>
        {arabic && (
          <span lang="ar" dir="rtl" className={`font-arabic text-lg ${light ? "text-gold-light/80" : "text-gold-dark/80"}`}>
            {arabic}
          </span>
        )}
      </div>
      <h2 className={`h-section mt-4 ${light ? "!text-ivory" : ""}`}>{title}</h2>
      {lead && <p className={`mt-5 text-[17px] leading-relaxed ${light ? "text-ivory/75" : "text-ink-muted"}`}>{lead}</p>}
    </div>
  );
}
