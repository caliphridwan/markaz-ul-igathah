import { Crest } from "./Crest";
import { site } from "@/lib/site";
import { SEGMENTS, type SegmentKey } from "@/lib/segments";

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
  role: string;
  segment: string | null;
};

function memberInfo(s: Student) {
  const isMember = s.role === "MEMBER";
  const seg = isMember && s.segment && s.segment in SEGMENTS ? SEGMENTS[s.segment as SegmentKey] : null;
  return { isMember, seg };
}

/**
 * CR80 ID card (85.6 × 54 mm). Everything inside is sized in `em`, so the card scales
 * on screen and prints at exactly 85.6mm when font-size is 1.6mm.
 */
const shell = "relative h-[33.75em] w-[53.5em] overflow-hidden rounded-[2em] text-[7px] min-[420px]:text-[8px] sm:text-[9.5px] print:text-[1.6mm] print:rounded-[1.5mm] shadow-lift print:shadow-none";

export function IdCardFront({ s }: { s: Student }) {
  const name = [s.firstName, s.otherName, s.lastName].filter(Boolean).join(" ");
  const { isMember, seg } = memberInfo(s);
  const role = isMember ? "Member" : s.status === "GRADUATED" ? "Alumnus" : "Student";
  // Labels and values use tight line-heights so the stack always fits above the footer strip.
  const label = "block text-[0.95em] font-bold uppercase leading-none tracking-[0.2em] text-ink-muted";
  const value = "mt-[0.25em] block text-[1.35em] font-semibold leading-[1.25]";
  return (
    <div className={`${shell} flex flex-col bg-ivory`}>
      <div className="pattern-ink absolute inset-0 opacity-[0.05]" style={{ backgroundSize: "6em 6em" }} />
      {/* header */}
      <div className="relative flex h-[7.2em] shrink-0 items-center gap-[1.2em] bg-walnut px-[2em] text-ivory">
        <div className="pattern-gold absolute inset-0 opacity-[0.12]" style={{ backgroundSize: "6em 6em" }} />
        <Crest size={44} className="relative h-[4.8em] w-[4.8em]" />
        <div className="relative flex-1 leading-none">
          <p className="font-display text-[2.2em] font-semibold">{site.name}</p>
          <p className="mt-[0.35em] text-[0.95em] font-bold uppercase tracking-[0.28em] text-gold-light">{role} identity card</p>
        </div>
        <p lang="ar" dir="rtl" className="relative font-ruqaa text-[2.2em] leading-none text-gold-light">{site.arabicName}</p>
      </div>
      <div className="h-[0.4em] shrink-0 bg-gold" />

      {/* body — fills exactly the space between header and footer */}
      <div className="relative flex min-h-0 flex-1 items-center gap-[2em] overflow-hidden px-[2em] py-[1.2em]">
        <div className="shrink-0">
          <div className="arch h-[15em] w-[11.8em] border-[0.25em] border-gold bg-parchment p-[0.35em]">
            <div className="arch h-full w-full overflow-hidden bg-sand">
              {s.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <span className={label}>Name</span>
          <p className="mt-[0.2em] line-clamp-2 font-display text-[2.15em] font-bold leading-[1.08] text-ink">{name}</p>
          {s.arabicName && (
            <p lang="ar" dir="rtl" className="truncate text-right font-arabic text-[1.55em] leading-[1.3] text-walnut">{s.arabicName}</p>
          )}
          <dl className="mt-[0.8em] grid grid-cols-2 gap-x-[1.5em] gap-y-[0.65em]">
            <div className="col-span-2">
              <dt className={label}>{isMember ? "Membership no." : "Matric no."}</dt>
              <dd className="mt-[0.2em] font-mono text-[1.6em] font-bold leading-[1.2] tracking-wide text-walnut">{s.matricNo}</dd>
            </div>
            <div className="col-span-2 min-w-0">
              <dt className={label}>{isMember ? "Segment" : "Programme"}</dt>
              <dd className={`${value} flex items-baseline justify-between gap-[0.6em] truncate`}>
                <span className="truncate">{isMember ? seg?.label ?? "Member" : s.programme?.title ?? "—"}</span>
                {seg && (
                  <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-[0.95em] font-normal" style={{ color: seg.color }}>
                    {seg.arabic}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className={label}>{isMember ? "Member since" : "Session"}</dt>
              <dd className={value}>{s.session ?? "—"}</dd>
            </div>
            <div>
              <dt className={label}>Gender</dt>
              <dd className={`${value} capitalize`}>{s.gender.toLowerCase()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* footer strip — in normal flow, so content can never sit underneath it */}
      <div
        className="relative flex h-[2.4em] shrink-0 items-center justify-between bg-walnut-900 px-[2em] text-[1em] font-semibold uppercase tracking-[0.2em] text-gold-light"
        style={seg ? { backgroundColor: seg.color } : undefined}
      >
        <span>{isMember ? `${seg?.label ?? "Member"} · Valid ${new Date().getFullYear()}` : `Valid · ${s.session} session`}</span>
        <span>Knowledge · Character · Service</span>
      </div>
    </div>
  );
}

export function IdCardBack({ qr, s }: { qr: string; s: Student }) {
  return (
    <div className={`${shell} bg-walnut-800 text-ivory`}>
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
