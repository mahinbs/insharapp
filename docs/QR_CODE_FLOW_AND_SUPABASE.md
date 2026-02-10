# QR Code Flow: Business & Influencer (and Supabase Setup)

## How It Works

### 1. When a booking is confirmed (Business accepts application)

- **Where:** Business accepts an influencer’s application (e.g. from Applications or Offer details).
- **Backend:** `acceptApplication()` in `lib/supabase-business.ts`:
  1. Creates a **collaboration** row (links application, offer, business, influencer, date/time).
  2. **Creates a QR code** for that collaboration:
     - Inserts into `qr_codes` with:
       - `business_id` = accepting business
       - `collaboration_id` = new collaboration id
       - `qr_data` = unique string like `inshaar-{collaborationId}-{timestamp}-{random}`
       - `is_active` = true
- **Result:** One QR code per collaboration. The **influencer** will show this QR; the **business** will scan it at the venue.

### 2. Influencer side: show QR at venue

- **Where:** Influencer app – e.g. **Collaborations** (per approved card “Show my QR”) or **Offer details** after acceptance.
- **Flow:**
  1. Influencer opens “Show my QR” for a collaboration (sends `collaborationId`).
  2. Frontend calls **GET `/api/collaboration-qr?collaborationId=...`** (with influencer session).
  3. API:
     - Ensures the collaboration exists and `influencer_id` = current user (so only the influencer of that collab can get the QR).
     - Reads from `qr_codes` the row for that `collaboration_id` (active) and returns `qr_data`.
  4. `InfluencerQRCode` component turns `qr_data` into a QR image (e.g. via `qrcode` library) and displays it.
- **Result:** Influencer shows this QR on their phone when they arrive; business will scan this same `qr_data`.

### 3. Business side: scan influencer’s QR at arrival

- **Where:** Business app – **Agenda** page, “Scan influencer QR” button.
- **Flow:**
  1. Business opens **BusinessQRScanner** (camera).
  2. Influencer shows their QR; business scans it. Scanner decodes the **raw string** (the `qr_data` value, e.g. `inshaar-...`).
  3. Frontend calls `checkInWithQRByScannedData(qrData)` from `lib/supabase-collaborations.ts` (with business session).
  4. Backend:
     - Looks up `qr_codes` by `qr_data`, `is_active = true`, and joins `collaborations`.
     - Checks that the collaboration’s `business_id` = current user (only that business can check in).
     - Updates **collaborations**: `checked_in_at`, `is_on_time`, `qr_code_scanned = true`.
     - Updates **qr_codes**: increments `scan_count`, sets `last_scanned_at`.
  5. UI can show booking details (e.g. influencer name, offer, time) in a modal.
- **Result:** Collaboration is marked as checked in; business has a record of who arrived and when.

---

## Summary Table

| Step | Who | Action | Supabase |
|------|-----|--------|----------|
| 1 | Business | Accepts application | Insert `collaborations` + insert `qr_codes` (with `qr_data`, `collaboration_id`, `business_id`) |
| 2 | Influencer | Opens “Show my QR” | API: read `collaborations` (influencer_id), then read `qr_codes` by `collaboration_id`, return `qr_data` |
| 3 | Business | Scans QR at venue | Look up `qr_codes` by `qr_data`, verify business, update `collaborations` (check-in) and `qr_codes` (scan count) |

---

## Supabase: What You Need

### Tables

1. **`qr_codes`** (must have):
   - `id` (uuid, PK)
   - `business_id` (uuid, FK to `profiles`) – business that owns the collaboration
   - `collaboration_id` (uuid, FK to `collaborations`) – one QR per collaboration
   - `qr_data` (text, unique) – string encoded in the QR (e.g. `inshaar-...`)
   - `is_active` (boolean, default true)
   - `scan_count` (integer, default 0)
   - `last_scanned_at` (timestamptz, optional)
   - Optional: `qr_image_url`, `expires_at`, `created_at`

2. **`collaborations`** (must have for check-in):
   - `checked_in_at` (timestamptz, nullable)
   - `is_on_time` (boolean, nullable)
   - `qr_code_scanned` (boolean, default false)

These match the definitions in `supabase_migration_complete.sql`, so **no schema change is required** if you have already run that migration.

### RLS (Row Level Security)

- **`qr_codes`:**
  - **Businesses can manage their own QR codes:** `auth.uid() = business_id` for ALL (SELECT/INSERT/UPDATE/DELETE). So the business that accepted the application can read/update the row (e.g. `scan_count`, `last_scanned_at`).
  - **Anyone can view active QR codes:** SELECT where `is_active = true`. This allows the **influencer** (via the API, with their own JWT) to read `qr_data` for their collaboration even though they are not `business_id`.
- **`collaborations`:**
  - Policies that allow business and influencer to read/update their own collaborations (so business can set `checked_in_at`, `qr_code_scanned`, etc.).

With these in place, **no RLS changes are required** for the current flow.

### Do you need to change anything in Supabase?

- **If you have already applied `supabase_migration_complete.sql` (or equivalent):**  
  **No.** The existing `qr_codes` and `collaborations` schema and RLS are enough for:
  - Creating a QR when the business accepts an application
  - Influencer fetching `qr_data` via the API and showing the QR
  - Business scanning the QR and checking in (updating `collaborations` and `qr_codes`).

- **If your project was created from an older migration:**  
  Ensure:
  1. **`qr_codes`** exists with at least: `id`, `business_id`, `collaboration_id`, `qr_data` (unique), `is_active`, `scan_count`, `last_scanned_at`.
  2. **`collaborations`** has: `checked_in_at`, `is_on_time`, `qr_code_scanned`.
  3. RLS on **`qr_codes`** allows: (a) business full access where `business_id = auth.uid()`, and (b) SELECT for everyone where `is_active = true` (so the influencer API can read `qr_data`).

Optional improvements (not required for the current flow):

- Add an index on `qr_codes(qr_data)` if you have high scan volume (your migration already has `idx_qr_codes_qr_data`).
- If you want QR codes to expire, use `expires_at` and in your code filter with `expires_at IS NULL OR expires_at > NOW()` when looking up by `qr_data`.

---

## Quick checklist

- [ ] Migration applied: `qr_codes` and `collaborations` columns above exist.
- [ ] RLS enabled on `qr_codes` and `collaborations`.
- [ ] Policies: business can manage own `qr_codes`; anyone can SELECT active `qr_codes`; business/influencer can read/update own `collaborations`.
- [ ] App: Business accepts application → QR is created; Influencer uses “Show my QR” → API returns `qr_data`; Business uses “Scan influencer QR” → check-in updates `collaborations` and `qr_codes`.

If all of the above are true, the QR part works for both business and influencer without further Supabase changes.
