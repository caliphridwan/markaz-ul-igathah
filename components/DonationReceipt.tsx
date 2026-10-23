import { Crest } from "./Crest";
import { amountInWords, date, money } from "@/lib/format";
import { site } from "@/lib/site";

type Props = {
  donation: {
    receiptNo: string | null;
    donorName: string;
    email: string;
    amount: number;
    reference: string;
    channel: string | null;
    paidAt: Date | null;
    message: string | null;
    cause: { title: string } | null;
  };
  qr: string;
  verifyUrl: string;
};

export function DonationReceipt({ donation: d, qr, verifyUrl }: Props) {
  return (
    <article className="print-area relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[20px] border border-sand bg-white shadow-lift">
      <header className="relative overflow-hidden bg-walnut px-8 py-7 text-ivory sm:px-10">
        <div className="pattern-gold absolute inset-0 opacity-[0.12]" />
        <div className="relative flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Crest size={58} />
            <div>
              <p className="font-display text-[1.7rem] font-semibold leading-none text-ivory">{site.name}</p>
              <p lang="ar" dir="rtl" className="mt-1 font-arabic text-lg text-gold-light">{site.arabicName}</p>
              <p className="mt-1 text-[11.5px] text-ivory/60">{site.address}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-light">Donation receipt</p>
            <p lang="ar" dir="rtl" className="font-arabic text-base text-ivory/80">إيصال تبرّع</p>
          </div>
        </div>
      </header>
      <div className="gold-rule" />

      <div className="relative px-8 py-8 sm:px-10">
        <div className="pattern-ink pointer-events-none absolute inset-0 opacity-[0.025]" />

        <div className="relative text-center">
          <p lang="ar" dir="rtl" className="font-ruqaa text-3xl text-walnut">جزاكم الله خيرًا</p>
          <p className="mt-2 text-[15px] text-ink-soft">
            We gratefully acknowledge the generous gift of <strong>{d.donorName}</strong>. May Allah accept it and multiply its reward.
          </p>
        </div>

        <div className="relative mt-7 grid gap-1 text-[13px] sm:grid-cols-2">
          <p><span className="text-ink-muted">Receipt no.</span> <span className="font-mono font-semibold">{d.receiptNo}</span></p>
          <p className="sm:text-right"><span className="text-ink-muted">Date</span> <span className="font-semibold">{date(d.paidAt, { dateStyle: "long", timeStyle: "short" })}</span></p>
        </div>

        <dl className="relative mt-5 divide-y divide-sand border-y border-sand">
          {[
            ["Donor", d.donorName],
            ["Email", d.email],
            ["Cause", d.cause?.title ?? "General Fund"],
            ["Payment ref.", d.reference],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-2.5 text-[14px]">
              <dt className="text-ink-muted">{k}</dt>
              <dd className="break-all font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="relative mt-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
          <p className="text-[12px] font-bold uppercase tracking-wider text-ink-muted">Amount donated</p>
          <p className="font-display text-4xl font-bold text-walnut">{money(d.amount)}</p>
        </div>
        <p className="relative mt-3 rounded-lg bg-parchment px-4 py-2.5 text-[13px] italic text-ink-soft">
          <span className="not-italic text-ink-muted">Amount in words: </span>{amountInWords(d.amount)}
        </p>
        {d.message && <p className="relative mt-3 text-[13.5px] italic text-ink-muted">&ldquo;{d.message}&rdquo;</p>}

        <div className="relative mt-8 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Verification QR code" className="h-24 w-24 rounded-lg border border-sand p-1" />
            <div className="text-[12px] text-ink-muted">
              <p className="font-semibold text-ink">Scan to verify</p>
              <p className="max-w-[230px] break-all">{verifyUrl}</p>
              <p className="mt-2">Channel: {d.channel ?? "online"}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-ruqaa text-2xl text-walnut" lang="ar" dir="rtl">أمين الصندوق</p>
            <div className="mt-1 h-px w-48 bg-ink/40" />
            <p className="mt-1 text-[12px] text-ink-muted">Treasurer, {site.name}</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-sand bg-parchment/70 px-8 py-3 text-center text-[11.5px] text-ink-muted sm:px-10">
        Computer-generated receipt, valid without a physical signature. {site.email} · {site.phone}
      </footer>
    </article>
  );
}
