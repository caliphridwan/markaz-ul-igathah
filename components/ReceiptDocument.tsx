import { Crest } from "./Crest";
import { amountInWords, date, fullName, money } from "@/lib/format";
import { site } from "@/lib/site";
import { segmentLabel } from "@/lib/segments";

type Props = {
  payment: { receiptNo: string | null; purpose: string; amount: number; reference: string; channel: string | null; paidAt: Date | null; feeItem: { session: string } | null };
  user: { firstName: string; lastName: string; otherName: string | null; matricNo: string | null; email: string; phone: string; programme: { title: string } | null; role: string; segment: string | null };
  qr: string;
  verifyUrl: string;
};

export function ReceiptDocument({ payment, user, qr, verifyUrl }: Props) {
  const rows: [string, string][] = [
    ["Received from", fullName(user)],
    [user.role === "MEMBER" ? "Membership no." : "Matric number", user.matricNo ?? "—"],
    user.role === "MEMBER" ? ["Segment", segmentLabel(user.segment)] : ["Programme", user.programme?.title ?? "—"],
    ["Session", payment.feeItem?.session ?? site.currentSession],
    ["Email / Phone", `${user.email} · ${user.phone}`],
  ];
  return (
    <article className="print-area relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[20px] border border-sand bg-white shadow-lift">
      {/* header band */}
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
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-light">Official receipt</p>
            <p lang="ar" dir="rtl" className="font-arabic text-base text-ivory/80">إيصال رسمي</p>
          </div>
        </div>
      </header>
      <div className="gold-rule" />

      <div className="relative px-8 py-8 sm:px-10">
        <div className="pattern-ink pointer-events-none absolute inset-0 opacity-[0.025]" />

        {/* PAID seal */}
        <div className="pointer-events-none absolute right-8 top-6 grid h-28 w-28 rotate-[-14deg] place-items-center rounded-full border-[3px] border-double border-jade/70 text-jade/80 sm:right-12">
          <div className="text-center leading-none">
            <p className="text-[10px] font-bold tracking-[0.2em]">MARKAZ</p>
            <p className="my-1 font-display text-3xl font-bold tracking-wider">PAID</p>
            <p className="text-[10px] font-bold tracking-[0.15em]">{date(payment.paidAt, { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        <div className="relative grid gap-1 text-[13px] sm:grid-cols-2">
          <p><span className="text-ink-muted">Receipt no.</span> <span className="font-mono font-semibold">{payment.receiptNo}</span></p>
          <p className="sm:text-right"><span className="text-ink-muted">Date</span> <span className="font-semibold">{date(payment.paidAt, { dateStyle: "long", timeStyle: "short" })}</span></p>
        </div>

        <dl className="relative mt-6 divide-y divide-sand border-y border-sand">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[150px_1fr] gap-4 py-2.5 text-[14px]">
              <dt className="text-ink-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <table className="relative mt-6 w-full text-[14px]">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[11.5px] uppercase tracking-wider text-ink-muted">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-sand">
              <td className="py-3 font-semibold">{payment.purpose}</td>
              <td className="py-3 text-right font-semibold">{money(payment.amount)}</td>
            </tr>
            <tr>
              <td className="pt-4 text-right font-bold uppercase tracking-wider">Total paid</td>
              <td className="pt-4 text-right font-display text-2xl font-bold text-walnut">{money(payment.amount)}</td>
            </tr>
          </tbody>
        </table>
        <p className="relative mt-3 rounded-lg bg-parchment px-4 py-2.5 text-[13px] italic text-ink-soft">
          <span className="not-italic text-ink-muted">Amount in words: </span>{amountInWords(payment.amount)}
        </p>

        <div className="relative mt-8 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Verification QR code" className="h-24 w-24 rounded-lg border border-sand p-1" />
            <div className="text-[12px] text-ink-muted">
              <p className="font-semibold text-ink">Scan to verify</p>
              <p className="max-w-[230px] break-all">{verifyUrl}</p>
              <p className="mt-2">Ref: <span className="font-mono">{payment.reference}</span></p>
              <p>Channel: {payment.channel ?? "online"}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-ruqaa text-2xl text-walnut" lang="ar" dir="rtl">المسجل</p>
            <div className="mt-1 h-px w-48 bg-ink/40" />
            <p className="mt-1 text-[12px] text-ink-muted">{site.registrar}</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-sand bg-parchment/70 px-8 py-3 text-center text-[11.5px] text-ink-muted sm:px-10">
        This is a computer-generated receipt and is valid without a physical signature. {site.email} · {site.phone}
      </footer>
    </article>
  );
}
