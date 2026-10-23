type Props = { size?: number; className?: string; tone?: "gold" | "ink" | "light" };

/** Institutional crest: an eight-pointed khatam star enclosing an open book (Qur'an) beneath a crescent. */
export function Crest({ size = 44, className = "", tone = "gold" }: Props) {
  const stroke = tone === "ink" ? "#4A2C1A" : tone === "light" ? "#FBF8F1" : "#C9A24B";
  const fill = tone === "ink" ? "#FBF8F1" : "#4A2C1A";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="12" y="12" width="40" height="40" rx="2" />
        <rect x="12" y="12" width="40" height="40" rx="2" transform="rotate(45 32 32)" />
      </g>
      <circle cx="32" cy="32" r="14.5" fill="none" stroke={stroke} strokeWidth="1" />
      {/* crescent */}
      <path d="M33.5 20.2a5 5 0 1 0 3.2 6.6 4 4 0 1 1-3.2-6.6Z" fill={stroke} />
      {/* open book */}
      <path
        d="M22 35.5c3.6-1.4 7-1.1 10 1.2 3-2.3 6.4-2.6 10-1.2v7.3c-3.6-1.3-7-1-10 1.2-3-2.2-6.4-2.5-10-1.2Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M32 36.7v7.3" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <span className="flex items-center gap-3">
      <Crest size={42} tone="gold" />
      <span className="leading-none">
        <span className={`block font-display text-[1.35rem] font-semibold tracking-tight ${light ? "text-ivory" : "text-ink"}`}>
          Markaz-ul-Igathah
        </span>
        <span lang="ar" dir="rtl" className={`mt-1 block font-arabic text-[13px] ${light ? "text-gold-light" : "text-gold-dark"}`}>
          مركز الإغاثة
        </span>
      </span>
    </span>
  );
}
