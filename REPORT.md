# FixMate: porting fixmatemobile into full_stack_development

Prepared 2026-10-04/05. Branch: `booking-update` (local only; not pushed, not merged).

| Commit | What |
|---|---|
| `8a69d0c` | Port booking slots, store hours and pricing updates from fixmatemobile |
| `a84e41e` | Stop tracking .env files and backend node_modules |

Base: `main` at `234d489` (the live repo, including the May 2026 SEO commits `a7ba295` and `234d489`).

---

## 1. Background

- `Documents/full_stack_development` → github.com/NishanBhuje1/full_stack_development (this is what deploys).
- `Documents/fixmatemobile` → github.com/NishanBhuje1/fixmatemobile (where the booking work was done). It now has a `live` remote pointing at full_stack_development.
- The two repos have **no shared git history**. fixmatemobile's first commit (`3cc6da6`, 2026-04-26) is a file-for-file copy of full_stack_development's fixmate folders at `46ca1eb` (ignoring `node_modules` and `.env`).
- After the copy, the live repo got 2 SEO commits (Ringwood landing page, `index.html`, Hero, Footer, Welcome, VisitStore, App). fixmatemobile got 1 commit (`5075d3c`) with the booking/pricing work.
- How it was ported: the diff `3cc6da6..5075d3c` was applied with `git apply --3way` onto a branch from `main`. Only `fixmate_mobile/src/App.jsx` conflicted. Both sides just added an import and a route, so both were kept. All SEO changes are still there.

---

## 2. Prisma migrations

All four were added in fixmatemobile commit `5075d3c` (2026-10-04, author NishanBhuje1). **None came from the live repo**, which only has `20251220110659_switch_to_fixed_price`.

| # | Migration | What it does |
|---|---|---|
| 1 | `20261003000000_update_iphone_screen_prices` | Updates 21 iPhone 13–16 screen prices (Premium and Aftermarket, in cents). Raises an exception and changes nothing unless **exactly 21 rows** match. It's skipped on an empty `Pricing` table. |
| 2 | `20261003000100_pricing_availability` | Makes `Pricing.price` nullable ("Get a quote") and adds `available BOOLEAN NOT NULL DEFAULT true` ("Not available"). Existing rows keep their price. |
| 3 | `20261003000200_add_iphone_17_series` | Inserts 21 rows: iPhone 17 / 17 Pro / 17 Pro Max × 7 repairs. Premium screen is priced, Aftermarket is unavailable, the rest are quote-only. A plain INSERT, so it fails if any of those rows already exist. |
| 4 | `20261004000000_booking_slots` | Adds `Lead.slotStart` and `Lead.reference` (unique) plus an index. Creates `StoreHours` and `StoreDateOverride`. Seeds the weekly opening hours. Additive only. |

You remembered creating 3. My guess is that #2 (`pricing_availability`) is the one you don't remember, because #3 depends on it (it inserts `NULL` prices and the `available` flag). That's a guess from the contents; git only shows that all four arrived in the same commit.

### Production status (read-only `prisma migrate status`)

Run against `ep-shy-mud-a7hu4puv-pooler.ap-southeast-2.aws.neon.tech` / `neondb`, the database both the local and the previously committed server `.env` point to:

```
5 migrations found in prisma/migrations
Following migrations have not yet been applied:
20261003000000_update_iphone_screen_prices
20261003000100_pricing_availability
20261003000200_add_iphone_17_series
20261004000000_booking_slots
```

I could not confirm that this is the database Render actually uses. Render's env vars weren't visible to me.

---

## 3. Production failure risk

**Migration #1 will abort `prisma migrate deploy` unless exactly 21 matching rows exist in production.** It matches on `brand = 'Apple iPhone'` plus exact `model` and `issue` strings. If any of those rows were renamed, deleted, or never created, the migration raises `Expected to update 21 Pricing rows, updated N`. The deploy then stops there, and #2–#4 are not applied.

What happens if that occurs:
- The new backend code expects `Pricing.available`, `Lead.slotStart`, `Lead.reference` and the `StoreHours` table. Without them, pricing, catalog, booking and store-hours requests will fail.
- So **the backend should not go live until all four migrations have succeeded.**

Check this read-only before deploying (not yet run):

```sql
SELECT count(*) FROM "Pricing"
WHERE "brand" = 'Apple iPhone'
  AND ("model", "issue") IN (
    ('iPhone 16','Screen Replacement - Premium'), ('iPhone 16 Plus','Screen Replacement - Premium'),
    ('iPhone 16 Pro','Screen Replacement - Premium'), ('iPhone 16 Pro Max','Screen Replacement - Premium'),
    ('iPhone 15','Screen Replacement - Premium'), ('iPhone 15 Plus','Screen Replacement - Premium'),
    ('iPhone 15 Pro','Screen Replacement - Premium'), ('iPhone 15 Pro Max','Screen Replacement - Premium'),
    ('iPhone 14','Screen Replacement - Premium'), ('iPhone 14 Plus','Screen Replacement - Premium'),
    ('iPhone 14 Pro','Screen Replacement - Premium'), ('iPhone 14 Pro Max','Screen Replacement - Premium'),
    ('iPhone 13','Screen Replacement - Premium'), ('iPhone 13 Pro','Screen Replacement - Premium'),
    ('iPhone 13 Pro Max','Screen Replacement - Premium'),
    ('iPhone 16','Screen Replacement - Aftermarket'), ('iPhone 16 Plus','Screen Replacement - Aftermarket'),
    ('iPhone 16 Pro','Screen Replacement - Aftermarket'), ('iPhone 16 Pro Max','Screen Replacement - Aftermarket'),
    ('iPhone 15 Pro','Screen Replacement - Aftermarket'), ('iPhone 15 Pro Max','Screen Replacement - Aftermarket')
  );
-- must return 21
```

Also check that no iPhone 17 rows exist yet, or #3 fails on the unique key:

```sql
SELECT count(*) FROM "Pricing" WHERE "model" LIKE 'iPhone 17%';  -- must return 0
```

---

## 4. VITE_API_URL finding

`fixmate_mobile/.env` contains only `VITE_API_URL`, set twice:
- `http://localhost:4000` (local dev)
- `https://fixmate-backend-gcck.onrender.com` (production; the comment above it says "set this in Vercel, NOT here")

Neither value is secret. The URL is public and gets baked into the browser bundle anyway.

**Risk:** the frontend has **no fallback**. `src/lib/api.js`, `src/lib/store.js`, `AdminDashboard.jsx`, `CustomQuote.jsx` and `Quote.jsx` all do `const API = import.meta.env.VITE_API_URL;`.

Commit `a84e41e` removes `fixmate_mobile/.env` from git. If `VITE_API_URL` is **not** set in Vercel's project environment variables, the production build was getting it from that committed file. After the merge it would be `undefined`, and every API call on the live site (quotes, booking, store hours, admin) would break.

Fix options if it isn't set in Vercel:
1. Add `VITE_API_URL=https://fixmate-backend-gcck.onrender.com` in Vercel (Production) before merging. **Recommended.**
2. Or add a code fallback to the Render URL.

---

## 5. Secrets and node_modules cleanup (commit `a84e41e`)

- `git rm --cached` on `fixmate_backend/server/.env` and `fixmate_mobile/.env`. Local copies are kept.
- `git rm -r --cached` on `fixmate_backend/server/node_modules` (2,691 files).
- `.gitignore`:
  - `fixmate_mobile/.gitignore`: added `.env`, `.env.*`, `!.env.example`. It previously had no `.env` rule. `node_modules` was already ignored.
  - `fixmate_backend/server/.gitignore`: added `.env.*`, `!.env.example`. `.env` and `node_modules` were already listed; the files were tracked only because they were committed before the rules existed.
- Checked with `git check-ignore`: both `.env` files and both `node_modules` folders are now ignored.

### Secrets that need rotating

The server `.env` was committed in 5 commits (`7219f7b` through `121eefd`) and stays in git history even after this change. Its variable names: `PORT, NODE_ENV, DATABASE_URL, CORS_ORIGIN, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, VITE_API_URL, RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, PUBLIC_SITE_URL, BUSINESS_REPLY_TO`.

Rotate: **Neon database password (`DATABASE_URL`), `JWT_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`.** Rotating `JWT_SECRET` logs out existing admin sessions.

### Render and npm install

There's no `render.yaml` in the repo, so the build command exists only in the Render dashboard, which I couldn't see. Indirect evidence that Render already runs `npm install`:
- The committed `node_modules` held only **Windows** Prisma engines (`query_engine-windows.dll.node`), and the schema sets no Linux `binaryTargets`. A Linux Render instance couldn't run those, yet production works. So Prisma Client must be generated during Render's build, which normally happens through `npm install` (`@prisma/client` postinstall).
- The new code also needs `luxon`, which was never in the committed `node_modules`. So an install step is required regardless.

---

## 6. Test results (step 4)

**Frontend (`fixmate_mobile`)**
- `vite build`: passes.
- `eslint src`: 9 errors, the same 9 as on `main` (unused `motion` imports caused by a config gap, an unused `err`, an unused `fireLeadConversion`). Nothing new.
- In the browser, against the local backend: the `/phone-repair-shop-ringwood` page renders, `/visit-store` loads hours from the API (status badge and SEO paragraph present), `/quote` lists iPhone 17 models with "Get a quote" / "Not available" labels. No console errors.

**Backend (`fixmate_backend/server`)**

Tested from a scratch copy with a fresh `npm ci`, a throwaway local Postgres 17 and a dummy Resend key. No production database was used and no email was sent.
- `prisma migrate deploy`: all 5 migrations apply. `prisma migrate diff`: the schema matches the migrations.
- `GET /api/store/hours`, `/api/booking/availability`, `/api/catalog`, `/api/pricing` (including the NOT_AVAILABLE and QUOTE_ONLY responses): OK.
- Admin: 401 without a token; `/api/admin/store-hours` and `/api/admin/pricing` OK with a token.
- Booking: 2 bookings fill a slot (201, references like `FM-XXXXX`), the 3rd gets 409 `SLOT_FULL`, an off-hours slot gets 400 `SLOT_INVALID`, and a legacy lead without a slot gets 201.

**Existing bug (not introduced by this branch, not fixed):** `POST /api/leads` with an empty or missing `fullName` returns 500. `leads.routes.js` sends `fullName: data.fullName || null`, but `Lead.fullName` is a required `String`. The same code is on `main`.

---

## 7. What you need to confirm before merging

1. **Vercel:** `VITE_API_URL` is set in the project's Production environment variables (see section 4). If it isn't, add it before merging, or the live frontend loses its API.
2. **Render:** Settings → Build Command runs `npm install` (or `npm ci`), and Root Directory is `fixmate_backend/server`.
3. **Database:** Render's `DATABASE_URL` points to the same Neon database checked above (`ep-shy-mud-…`).
4. **Migration #1:** the 21-row count query returns 21, and the iPhone 17 count returns 0 (section 3).
5. **Secrets:** rotate the Neon password, `JWT_SECRET`, `ADMIN_PASSWORD` and `RESEND_API_KEY`, then update them in Render.

### Suggested deploy order (once all of the above checks out)
1. Merge `booking-update` → `main` and push. Vercel and Render rebuild.
2. Run `npx prisma migrate deploy` against production straight away. The new backend code fails on pricing and booking requests until the migrations are applied.
3. Smoke-test: the Quote page, a test booking, Visit Store hours, and the admin store-hours editor.

---

## 8. Housekeeping

- The `live` remote is still configured in `Documents/fixmatemobile`.
- The scratchpad holds `booking.patch`, the scratch backend copy, and a stopped throwaway Postgres data folder (`pgdata`). The safety check blocked my removal command, so delete it manually if you want it gone.
- This file (`REPORT.md`) is untracked and not committed.
