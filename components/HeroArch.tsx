import { site } from "@/lib/site";

/** The hero's centrepiece: a mihrab arch with calligraphy, geometric lattice and a slowly turning star. */
export function HeroArch() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
      {/* rotating star halo */}
      <svg viewBox="0 0 400 400" className="enter-fade d-4 absolute -left-10 -top-6 w-[115%] animate-spin-slow opacity-30" aria-hidden="true">
        <g fill="none" stroke="#C9A24B" strokeWidth=".8">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="90" y="90" width="220" height="220" transform={`rotate(${i * 7.5} 200 200)`} />
          ))}
        </g>
      </svg>

      {/* outer gold arch */}
      <div className="arch arch-reveal absolute inset-0 border border-gold/60 p-3">
        <div className="arch relative h-full w-full overflow-hidden bg-gradient-to-b from-walnut via-walnut-700 to-walnut-900 shadow-lift">
          <div className="pattern-gold pattern-drift absolute inset-0 opacity-[0.16]" />
          <div className="arch absolute inset-5 border border-gold/40" />
          {/* lamp */}
          <div className="absolute left-1/2 top-[13%] w-12 -translate-x-1/2">
            <svg viewBox="0 0 60 110" className="lamp-sway w-12" aria-hidden="true">
            <path d="M30 0v26" stroke="#E6CF8F" strokeWidth="1" />
            <path d="M18 30h24l6 18c2 7-4 16-18 16S10 55 12 48Z" fill="#C9A24B" opacity=".9" />
            <path d="M22 64h16l-3 10h-10Z" fill="#A6823A" />
            <circle cx="30" cy="46" r="11" fill="#FBF3D9" fillOpacity=".22" className="lamp-glow" />
            <circle cx="30" cy="46" r="6" fill="#FBF3D9" className="lamp-glow" />
          </svg>
          </div>
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 text-center">
            <p lang="ar" dir="rtl" className="enter d-5 text-shimmer font-ruqaa text-[4.4rem] leading-[1.25] text-gold-light drop-shadow-[0_2px_20px_rgba(201,162,75,.35)] sm:text-[5rem]">
              مركز
              <br />
              الإغاثة
            </p>
          </div>
          <div className="enter d-7 absolute inset-x-8 bottom-10 text-center">
            <div className="rule-draw mx-auto h-px w-24 bg-gold/60" />
            <p className="mt-4 font-display text-lg italic text-ivory/80">Knowledge · Character · Service</p>
          </div>
        </div>
      </div>

      {/* floating cards */}
      <div className="float-a absolute -left-6 bottom-24 hidden rounded-2xl border border-sand bg-ivory/95 px-5 py-4 shadow-lift backdrop-blur sm:block">
        <p className="font-display text-3xl font-semibold text-walnut">Est. {site.founded}</p>
        <p className="text-[12.5px] font-semibold uppercase tracking-wider text-ink-muted">Serving the Ummah</p>
      </div>
      <div className="float-b absolute -right-4 top-28 hidden rounded-2xl border border-gold/30 bg-walnut-900/95 px-5 py-4 text-ivory shadow-lift sm:block">
        <p className="text-[12px] font-bold uppercase tracking-wider text-gold-light">Sanad-connected</p>
        <p className="font-display text-xl">Ijazah teachers</p>
      </div>
    </div>
  );
}
