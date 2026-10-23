import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { qrDataUrl } from "@/lib/qr";
import { siteUrl } from "@/lib/site";
import { PortalHeader } from "@/components/PortalNav";
import { PrintButton } from "@/components/PrintButton";
import { IdCardBack, IdCardFront } from "@/components/IdCard";

export default async function IdCardPage() {
  const user = await requireUser();
  const active = user.status === "ACTIVE" || user.status === "GRADUATED";
  const ready = active && !!user.photo;

  if (!ready) {
    const checks = [
      { ok: active, text: "Account activated (pay the acceptance fee)", href: "/dashboard/payments" },
      { ok: !!user.photo, text: "Passport photograph uploaded", href: "/dashboard/profile" },
    ];
    return (
      <>
        <PortalHeader title="ID card" arabic="بطاقة الهوية" />
        <div className="card max-w-xl p-8">
          <h2 className="text-2xl">Almost there</h2>
          <p className="mt-2 text-ink-muted">Your official ID card is generated as soon as these are complete:</p>
          <ul className="mt-6 space-y-3">
            {checks.map((c) => (
              <li key={c.text}>
                <Link href={c.href} className="flex items-center gap-3 rounded-xl border border-sand px-4 py-3 hover:border-emerald/40">
                  {c.ok ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-jade text-white"><Check size={14} /></span>
                  ) : (
                    <Circle size={24} className="text-sand-dark" />
                  )}
                  <span className={c.ok ? "text-ink-muted line-through" : "font-semibold"}>{c.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  const qr = await qrDataUrl(`${siteUrl}/verify/student/${user.id}`);
  return (
    <>
      <PortalHeader title="ID card" arabic="بطاقة الهوية">
        <PrintButton label="Print ID card" />
      </PortalHeader>
      <p className="no-print -mt-4 mb-8 max-w-2xl text-sm text-ink-muted">
        Prints at the standard CR80 size (85.6 × 54 mm). In the print dialog choose &ldquo;Background graphics&rdquo; and 100% scale, then cut along the edges or take it to any ID card printer.
      </p>
      <div className="print-area flex flex-col items-center gap-8 2xl:flex-row 2xl:items-start print:flex-row print:gap-[6mm]">
        <div>
          <p className="no-print mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink-muted">Front</p>
          <IdCardFront s={user} />
        </div>
        <div>
          <p className="no-print mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink-muted">Back</p>
          <IdCardBack s={user} qr={qr} />
        </div>
      </div>
    </>
  );
}
