# Build Prompt — Markaz-ul-Igathah (مركز الإغاثة)

> Paste this whole document into your AI coding assistant (Claude Code, Cursor, etc.) to build or extend the platform. It is written to be self-contained.

---

## 1. Role & goal

You are a senior full-stack engineer and product designer. Build **Markaz-ul-Igathah** (Arabic: **مركز الإغاثة**, "The Centre of Succour"), a premium Arabic & Islamic educational institution website and student portal.

It must feel like a **prestigious, established institution** — calm, dignified, and extremely beautiful — not a template. Think: the website of a centuries-old madrasah that has just hired a world-class design studio.

The platform has two halves:

1. **Public website** — tells the institution's story and converts visitors into applicants.
2. **Student portal** — students register, log in, pay fees, download receipts, generate an ID card, and join the alumni network. Admins manage everything.

---

## 2. Tech stack (conventional, no exotic choices)

| Layer | Choice |
|---|---|
| Framework | **Next.js 15, App Router**, TypeScript, React Server Components + Server Actions |
| Styling | **Tailwind CSS 3.4** with a custom design-token theme |
| Database | **PostgreSQL** via **Prisma 6** |
| Auth | Email + password, **bcryptjs** hashing, **JWT (jose, HS256)** in an `httpOnly` secure cookie, route protection in `middleware.ts` |
| Validation | **zod** on every server action and API route |
| Payments | **Paystack** (NGN, amounts stored in kobo) — initialize → redirect → verify callback + signed webhook. Demo mode when no key is set |
| Documents | Receipts & ID cards rendered as print-perfect HTML pages (`@media print`, exact sizes) with **QR codes** (`qrcode`) linking to a public verification page |
| Icons | `lucide-react` |
| Fonts | `next/font/google`: **Cormorant Garamond** (display serif), **Manrope** (UI sans), **Amiri** (Arabic text), **Aref Ruqaa** (Arabic calligraphic display) |
| Deploy | **Render** (Web Service + Render Postgres). Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` |

No external file storage: student passport photos are resized in the browser to ~300×360 JPEG and stored as a data URL (≤ 150 KB).

---

## 3. Design direction

**Concept: "The Illuminated Manuscript."** Ivory parchment pages, deep emerald ink, gold leaf, and Islamic geometry.

- **Palette (tokens):**
  - `ink` #0A1F1A (near-black green, primary text & dark sections)
  - `emerald` #0F4C3A / `emerald-700` #0B3A2C (brand)
  - `jade` #1F7A5C (interactive accents)
  - `gold` #C9A24B, `gold-light` #E6CF8F (rules, highlights, seals — used sparingly)
  - `parchment` #F7F1E3, `ivory` #FBF8F1 (page backgrounds)
  - `sand` #E9DFC8 (borders, dividers)
- **Typography:** large Cormorant Garamond headlines with tight tracking; Manrope for UI at 15–16px; Arabic in Aref Ruqaa for display and Amiri for running text, always `dir="rtl"` and `lang="ar"`.
- **Motifs:**
  - An SVG **8-point star (khatam) tessellation** used as a faint background texture (3–8% opacity), never loud.
  - **Mihrab arch** frames (`border-radius: 999px 999px 0 0`) for hero art, programme cards and the ID-card photo.
  - Thin **double gold rules** and small ornament dividers (✦) between sections.
  - Bilingual section labels: small-caps English eyebrow + Arabic word beside it.
- **Layout:** generous whitespace, 12-col grid, max width 1200px, asymmetric hero. Dark emerald "manuscript" bands alternate with parchment sections.
- **Motion:** subtle only — fade/translate on scroll (CSS), hover lifts on cards. Respect `prefers-reduced-motion`.
- **Quality bar:** responsive from 360px up, WCAG AA contrast, visible focus rings, semantic HTML, keyboard navigable, Lighthouse ≥ 90.

---

## 4. Information architecture

### Public
- `/` Home — hero (Arabic calligraphy in an arch + mission line + two CTAs), "At a glance" stats, About teaser, Programmes grid, The Path (4-step admission timeline), Why Markaz (pillars), Words from the Mudir (quote), Testimonials, Announcements, final CTA band.
- `/about` — history, vision & mission, values, leadership.
- `/programmes` — all programmes with duration, mode, schedule, fee from the database.
- `/admissions` — requirements, process, fee schedule (from DB), FAQ.
- `/alumni` — public alumni wall (only profiles marked visible) + join CTA.
- `/contact` — form saved to DB, address, phone, map placeholder.
- `/verify/student/[id]` and `/verify/receipt/[receiptNo]` — public QR verification pages showing a green "Verified" seal or "Not found".
- `/login`, `/register`.

### Student portal (`/dashboard`, auth required)
- **Overview** — greeting, matric number, status badge, outstanding fees, recent payments, announcements, quick actions.
- **Payments** — list of applicable fee items (per programme or general) with paid / unpaid state; "Pay now" starts Paystack checkout. History table.
- **Receipts** — list + `/dashboard/receipts/[id]` printable A5 receipt with crest, receipt no., student details, item, amount (in words too), reference, date, QR, gold "PAID" seal.
- **ID Card** — CR80 size (85.6 × 54 mm) front & back, printable. Front: crest, name in English and space for Arabic, photo in an arch frame, matric no., programme, session, validity. Back: QR to verification, terms, return address, signature line. Requires status ACTIVE/GRADUATED and an uploaded photo.
- **Alumni** — graduates create/edit their alumni profile (grad year, occupation, location, bio, LinkedIn, visibility toggle).
- **Profile** — edit contact details, guardian, passport photo upload (client-side resize), change password.

### Congregation membership (`/membership`, `/membership/join`, role MEMBER)
- Members of the masjid sign up into one of five segments: **Elders (الشيوخ)**, **Ibadur Rahman (عباد الرحمن)**, **Zeenatul Igathah (زينة الإغاثة)**, **Fatayaatul Igathah (فتيات الإغاثة)**, **Member (عضو)** — defined once in `lib/segments.ts` with label, Arabic, colour, code and description.
- Membership number per segment per year: `MUI/{CODE}/{year}/{0000}` (ELD, IBR, ZEN, FAT, MEM).
- Members share the portal (overview, payments, receipts, ID card, profile — no alumni tab). Fees have an `audience` (STUDENT | MEMBER) and optional `segment`; members see only member dues.
- Membership activates when an admin approves it or when dues marked "activates account" are paid.
- Membership ID card: same CR80 design, labelled "Member identity card", shows membership no., segment (English + Arabic) and "member since", footer strip in the segment colour; QR verifies at `/verify/student/[id]` as "Verified member".
- Admin `/admin/members`: counts per segment, search/filter, approve/suspend.

### Admin (`/admin`, role ADMIN)
- **Overview** — counts (students by status, revenue total, payments today), latest registrations.
- **Students** — search/filter, view, set status (Pending → Active → Graduated / Suspended).
- **Payments** — all transactions with status and reference.
- **Fees** — create fee items (name, amount, session, programme or all, "activates account" flag), toggle active.
- **Announcements** — create / pin / delete.
- **Messages** — contact-form inbox.

---

## 5. Data model (Prisma)

- `User` — id, email (unique), passwordHash, role (STUDENT | ADMIN), firstName, lastName, otherName, phone, gender, dateOfBirth, address, stateOfOrigin, guardianName, guardianPhone, photo, matricNo (unique, e.g. `MUI/2026/0001`), entryType (NEW_STUDENT | ALUMNUS), status (PENDING | ACTIVE | GRADUATED | SUSPENDED), programmeId, session, timestamps.
- `Programme` — slug, title, arabicTitle, summary, duration, mode, schedule, order.
- `FeeItem` — name, description, amount (kobo, Int), session, programmeId (nullable = applies to all), activatesAccount, active.
- `Payment` — user, feeItem, amount, reference (unique), status (PENDING | SUCCESS | FAILED), channel, receiptNo (unique, `MUI-RCP-2026-000001`), paidAt.
- `AlumniProfile` — user (1:1), graduationYear, occupation, location, bio, linkedin, visible.
- `Announcement` — title, body, pinned.
- `ContactMessage` — name, email, phone, subject, message, read.
- `Counter` — id, value (atomic sequences for matric and receipt numbers).

---

## 6. Business rules

1. Registration creates a STUDENT with status **PENDING** and an auto-generated matric number from an atomic counter (`MUI/{year}/{0000}`).
2. Paying any fee item with `activatesAccount = true` (e.g. Acceptance Fee) automatically moves PENDING → ACTIVE.
3. A payment is only marked SUCCESS after **server-side verification** with Paystack (`GET /transaction/verify/:reference`) — never trust the redirect alone. The webhook (`charge.success`, HMAC-SHA512 signature check) is idempotent with the callback.
4. Amount charged is always read from the DB fee item, never from the client.
5. A fee item already paid by the student cannot be paid again.
6. Receipts can only be viewed by their owner or an admin; verification pages expose only non-sensitive fields (name, matric, programme, status / item, amount, date).
7. Alumni applicants (`entryType = ALUMNUS`) stay PENDING until an admin marks them GRADUATED.
8. All money displayed with `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`.

---

## 7. Security checklist

- bcrypt cost 12; JWT secret ≥ 32 chars from env; cookie `httpOnly`, `sameSite=lax`, `secure` in production, 7-day expiry.
- Middleware gates `/dashboard/*` and `/admin/*`; every server action re-checks the session and role (middleware is not the only guard).
- zod validation on all input; generic login error messages.
- Paystack webhook signature verified with the secret key; reject otherwise.
- No secrets in client bundles; only `NEXT_PUBLIC_SITE_URL` is public.

---

## 8. Environment variables

```
DATABASE_URL=postgresql://user:pass@host:5432/markaz
JWT_SECRET=change-me-to-a-long-random-string-at-least-32-chars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYMENTS_DEMO_MODE=true   # only honoured when PAYSTACK_SECRET_KEY is empty
ADMIN_EMAIL=admin@markazuligathah.org
ADMIN_PASSWORD=ChangeMe!2026
```

---

## 9. Seed data

Seed programmes (Tahfeez-ul-Qur'an, Arabic Language, Diploma in Islamic Studies, Tajweed & Qira'at, Children's Madrasah, Adult Evening Classes), fee items (Application, Acceptance — activates account, Tuition per programme, ID Card), two announcements, and one admin account from env.

---

## 10. Deliverables

- Complete, runnable repository with `README.md` (local setup + Render deploy steps), `.env.example`, Prisma schema + seed, all pages above.
- Editable institution details (address, phone, email, founding year, Mudir's name, socials) centralised in `lib/site.ts`.
- No lorem ipsum: write dignified, specific copy. Mark anything that needs the institution's real data with a clear comment in `lib/site.ts`.
