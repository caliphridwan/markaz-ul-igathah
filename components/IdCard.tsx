import { Crest } from "./Crest";
import { site } from "@/lib/site";

type Student = {
  firstName: string;
  lastName: string;
  otherName: string | null;
  arabicName: string | null;
  matricNo: string | null;
  gender: string;
  session: string | null;
  status: string;
  photo: string | null;
  programme: { title: string } | null;
};

/**
 * CR80 ID card (85.6 × 54 mm). Everything inside is sized in `em`, so the card scales
 * on screen and prints at exactly 85.6mm when font-size is 1.6mm.
 */
const shell = "relative h-[33.75em] w-[53.5em] overflow-hidden rounded-[2em] text-[7px] min-[420px]:text-[8px] sm:text-[9.5px] print:text-[1.6mm] print:rounded-[1.5mm] shadow-lift print:shadow-none";

export function IdCardFront({ s }: { s: Student }) {
  const name = [s.firstName, s.otherName, s.lastName].filter(Boolean).join(" ");
  const role = s.status === "GRADUATED" ? "Alumnus" : "Student";
  return (
    <div className={`${shell} bg-ivory`}>
      <div className="pattern-ink absolute inset-0 opacity-[0.05]" style={{ backgroundSize: "6em 6em" }} />
      {/* header */}
      <div className="relative flex h-[8.4em] items-center gap-[1.2em] bg-emerald px-[2em] text-ivory">
        <div className="pattern-gold absolute inset-0 opacity-[0.12]" style={{ backgroundSize: "6em 6em" }} />
        <Crest size={44} className="relative h-[5.4em] w-[5.4em]" />
        <div className="relative flex-1 leading-none">
          <p className="font-display text-[2.3em] font-semibold">{site.name}</p>
          <p className="mt-[0.35em] text-[1em] font-bold uppercase tracking-[0.28em] text-gold-light">{role} identity card</p>
        </div>
        <p lang="ar" dir="rtl" className="relative font-ruqaa text-[2.4em] text-gold-light">{site.arabicName}</p>
      </div>
      <div className="h-[0.45em] bg-gold" />

      {/* body */}
      <div className="relative flex gap-[2em] px-[2em] pt-[1.8em]">
        <div className="shrink-0">
          <div className="arch h-[16em] w-[12.6em] border-[0.25em] border-gold bg-parchment p-[0.35em]">
            <div className="arch h-full w-full overflow-hidden bg-sand">
              {s.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[1em] font-bold uppercase tracking-[0.2em] text-ink-muted">Name</p>
          <p className="font-display text-[2.5em] font-bold leading-[1.05] text-ink">{name}</p>
          {s.arabicName && (
            <p lang="ar" dir="rtl" className="text-right font-arabic text-[1.9em] leading-tight text-emerald">{s.arabicName}</p>
          )}
          <dl className="mt-[1em] grid grid-cols-2 gap-x-[1.5em] gap-y-[0.8em]">
            <div className="col-span-2">
              <dt className="text-[1em] font-bold uppercase tracking-[0.2em] text-ink-muted">Matric no.</dt>
              <dd className="font-mono text-[1.75em] font-bold tracking-wide text-emerald">{s.matricNo}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[1em] font-bold uppercase tracking-[0.2em] text-ink-muted">Programme</dt>
              <dd className="truncate text-[1.45em] font-semibold">{s.programme?.title ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[1em] font-bold uppercase tracking-[0.2em] text-ink-muted">Session</dt>
              <dd className="text-[1.45em] font-semibold">{s.session}</dd>
            </div>
            <div>
              <dt className="text-[1em] font-bold uppercase tracking-[0.2em] text-ink-muted">Gender</dt>
              <dd className="text-[1.45em] font-semibold capitalize">{s.gender.toLowerCase()}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[2.6em] items-center justify-between bg-emerald-900 px-[2em] text-[1em] font-semibold uppercase tracking-[0.2em] text-gold-light">
        <span>Valid · {s.session} session</span>
        <span>Knowledge · Character · Service</span>
      </div>
    </div>
  );
}

export function IdCardBack({ qr, s }: { qr: string; s: Student }) {
  return (
    <div className={`${shell} bg-emerald-800 text-ivory`}>
      <div className="pattern-gold absolute inset-0 opacity-[0.1]" style={{ backgroundSize: "6em 6em" }} />
      <div className="relative flex h-full gap-[2.2em] p-[2.2em]">
        <div className="flex shrink-0 flex-col items-center">
          <div className="rounded-[1.2em] bg-white p-[0.7em]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Verification QR code" className="h-[14em] w-[14em]" />
          </div>
          <p className="mt-[0.8em] text-[1em] font-bold uppercase tracking-[0.2em] text-gold-light">Scan to verify</p>
          <p className="mt-[0.2em] font-mono text-[1.2em] text-ivory/80">{s.matricNo}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p lang="ar" dir="rtl" className="text-right font-ruqaa text-[2.2em] text-gold-light">وقل رب زدني علما</p>
          <p className="mt-[0.8em] text-[1.25em] leading-[1.5] text-ivory/85">
            This card is the property of {site.name} and must be carried at all times on campus. It is not transferable.
          </p>
          <p className="mt-[0.8em] text-[1.25em] leading-[1.5] text-ivory/85">If found, kindly return to:</p>
          <p className="text-[1.2em] leading-[1.45] text-ivory/70">{site.address}</p>
          <p className="text-[1.2em] text-ivory/70">{site.phone}</p>
          <div className="mt-auto flex items-end justify-between">
            <Crest size={36} className="h-[4.2em] w-[4.2em]" />
            <div className="text-center">
              <p className="font-ruqaa text-[2em] leading-none text-gold-light" lang="ar" dir="rtl">المدير</p>
              <div className="mt-[0.3em] h-px w-[14em] bg-ivory/40" />
              <p className="mt-[0.3em] text-[1em] uppercase tracking-[0.2em] text-ivory/60">{site.mudir.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
