# Markaz-ul-Igathah · مركز الإغاثة

Premium website and student portal for an Arabic & Islamic institution.
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Paystack.

**What's inside**

- Public site: Home, About, Programmes, Admissions (live fee schedule), Alumni wall, Contact, QR verification pages
- Student portal: register / log in, auto matric number (`MUI/2026/0001`), pay fees via Paystack, instant receipts with QR, printable CR80 ID card (front & back), alumni profile, profile & passport photo, password change
- Congregation membership: masjid members sign up at `/membership/join` into one of five segments — Elders, Ibadur Rahman, Zeenatul Igathah, Fatayaatul Igathah, Member — get a membership number (`MUI/IBR/2026/0001`), pay dues and print a segment-coloured membership ID card
- Admin: overview stats, members by segment, student management (approve / graduate / suspend), payments ledger, fee items, announcements, contact inbox

The full product brief used to build this is in [`PROMPT.md`](./PROMPT.md).

---

## 1. Run locally (macOS)

You need Node 20+ and a PostgreSQL database. Pick one:

- **No install (easiest):** create a free Postgres at neon.tech or a Render Postgres, and copy its connection string.
- **On your Mac:** install Postgres.app (works on Big Sur), open it, then run `createdb markaz`.
  Connection string: `postgresql://YOUR_MAC_USERNAME@localhost:5432/markaz`

```bash
cd markaz-ul-igathah
cp .env.example .env     # paste your DATABASE_URL, set a long JWT_SECRET
npm install
npm run setup            # creates all tables + seeds programmes, fees and demo data
npm run dev
```

Open http://localhost:3000/login — the demo accounts are listed there; click one to sign in.

### Demo logins (password for all: `Demo@2026`)

| Role | Email | What to try |
|---|---|---|
| Admin | demo.admin@markazuligathah.org | Approve/graduate students, fees, announcements, inbox |
| Active student | student@markazuligathah.org | 3 paid receipts, ready-to-print ID card |
| New applicant | applicant@markazuligathah.org | Pay the acceptance fee → account activates |
| Alumnus | alumni@markazuligathah.org | Alumni profile on the public wall |
| Member · Ibadur Rahman | member@markazuligathah.org | Membership ID card, dues receipt |
| Member · pending | general.demo@markazuligathah.org | Pay dues → membership activates |

Your own admin account is also created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
With no Paystack key and `PAYMENTS_DEMO_MODE="true"`, payments complete instantly.

**Before launch:** set `DEMO_MODE="false"` (hides the panel and stops seeding demo users) and delete the demo users from the admin or database.

## 2. Paystack

1. Put your `sk_test_…` key in `PAYSTACK_SECRET_KEY` (demo mode switches off automatically).
2. In the Paystack dashboard → Settings → API Keys & Webhooks, set the webhook URL to
   `https://YOUR-DOMAIN/api/payments/webhook`.
3. Callback URL is set per transaction automatically: `NEXT_PUBLIC_SITE_URL/api/payments/callback`.

Payments are only marked successful after the server verifies them with Paystack, and the charged amount always comes from the database.

## 3. Deploy on Render

Option A — Blueprint (creates the database for you): push to GitHub, then in Render choose **New → Blueprint** and select the repo. `render.yaml` creates the Postgres database and the web service, runs the migration and the seed on every deploy (the seed is safe to re-run). Fill in `NEXT_PUBLIC_SITE_URL`, `PAYSTACK_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — demo logins work straight away.

Option B — manual (same as AlFawz):

- Create a Render Postgres database; copy its **Internal Database URL**.
- Create a Web Service from the repo.
  - Build command: `npm install && npx prisma migrate deploy && npx prisma db seed && npm run build`
  - Start command: `npm start`
  - Env vars: everything in `.env.example` (set `PAYMENTS_DEMO_MODE=false`).

## 4. Customise

- Institution details (address, phone, email, founding year, Mudir, stats): `lib/site.ts`
- Membership segments (names, Arabic, colours, descriptions, number codes): `lib/segments.ts`
- Colours & fonts: `tailwind.config.ts`, `app/layout.tsx`
- Programmes & fees: seed file `prisma/seed.mjs`, or manage fees live from `/admin/fees`
- Contact map: replace the placeholder in `app/(site)/contact/page.tsx` with a Google Maps iframe

## 5. Structure

```
app/
  (site)/        public pages + /verify
  (auth)/        login, register
  dashboard/     student portal (payments, receipts, id-card, alumni, profile)
  admin/         registry admin
  api/payments/  Paystack callback + webhook
  actions/       server actions (auth, student, admin, contact)
components/      Crest, header/footer, portal nav, receipt, ID card, forms
lib/             db, auth/session (JWT), payments, counters, formatting, site config
prisma/          schema + seed
```
