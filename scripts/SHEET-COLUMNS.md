# Google Sheet — Plan My Trip + Payment Tracking (one tab)

Everything lives on **Sheet1**. Each Plan My Trip submission is **one row**. Payments update **that same row** — no second tab.

---

## Flow

1. **Customer submits Plan My Trip** → a new row is added (trip details only; payment columns stay blank).
2. **You review the request** → when you send a quotation, fill in **Quotation #** and **Tour Amount (USD)** on that row.
3. **Customer pays on `/payments`** using that quotation number → payment columns on **the same row** update automatically.

---

## Column map (row 1 = headers)

### Existing — filled automatically when someone submits Plan My Trip

| Col | Header | Source |
|-----|--------|--------|
| A | Submitted At | Auto (timestamp) |
| B | First Name | Form |
| C | Last Name | Form |
| D | Email Address | Form |
| E | Phone / WhatsApp | Form |
| F | Country of Residence | Form |
| G | Preferred Contact Method | Form |
| H | Arrival Date | Form *(also used for Days Till Arrival)* |
| I | Departure Date | Form |
| J | Number of Days | Form |
| K | Adults | Form |
| L | Infants | Form |
| M | Children | Form |
| N | Teens | Form |
| O | Travelling with Pets | Form |
| P | Pet Details | Form |
| Q | Destinations | Form |
| R | Other Destinations | Form |
| S | Hotel Rating | Form |
| T | Room Types | Form |
| U | Meal Plan | Form |
| V | Mixed Meal Plan Details | Form |
| W | Activities | Form |
| X | Other Activities | Form |
| Y | Preferred Language | Form |
| Z | Driver Gender Preference | Form |
| AA | Preferred Driver Age | Form |
| AB | LGBTQ Friendly Driver | Form |
| AC | Child Friendly Driver | Form |
| AD | Food Preferences | Form |
| AE | Spice Level | Form |
| AF | Allergies / Medical | Form |
| AG | Cultural Preferences | Form |
| AH | Cultural Details | Form |
| AI | Budget | Form |
| AJ | Dream Trip | Form |
| AK | Terms Agreed | Form |
| AL | Full Trip Request | Form (summary text) |

### New — you fill manually (once per booking)

| Col | Header | Who fills it | When |
|-----|--------|--------------|------|
| **AM** | **Quotation #** | **You** | When you send the quote (e.g. `CU-2026-001`) |
| **AN** | **Tour Amount (USD)** | **You** | Total quoted price — used for % paid and amount owed |

### New — updated automatically when a payment succeeds

| Col | Header | What happens |
|-----|--------|--------------|
| **AO** | **Total Paid (USD)** | Adds each payment (cumulative) |
| **AP** | **% Paid** | `Total Paid ÷ Tour Amount` |
| **AQ** | **Amount Owed (USD)** | `Tour Amount − Total Paid` |
| **AR** | **Payment Status** | `Partial` or `All Paid` |
| **AS** | **Days Till Arrival** | Calculated from **Arrival Date** (col H) |
| **AT** | **Last Payment Date** | Date/time of the most recent payment |
| **AU** | **Last Milestone** | e.g. 25% Deposit, 50% Second Payment |
| **AV** | **Transaction References** | Every payment ref appended in this cell (`ref1 \| ref2 \| ref3`) |

---

## What gets amended vs what stays the same

| When | Columns changed |
|------|-----------------|
| Plan My Trip submit | **A–AL** appended (new row). **AM–AV** left empty. |
| You send quotation | **You edit AM + AN** only on that row. |
| Customer pays | **AO–AV** updated on the row where **AM** matches their quotation #. **A–AN are not overwritten.** |

Each additional payment **adds** to Total Paid (AO) and refreshes AP–AV. Trip details in A–AL never change.

---

## Setup steps

### 1. Add headers in your Google Sheet

In **Sheet1**, row 1 should have all headers A through **AV**. If your sheet already has A–AL from Plan My Trip, add these **10 new headers** after `Full Trip Request`:

```
Quotation # | Tour Amount (USD) | Total Paid (USD) | % Paid | Amount Owed (USD) | Payment Status | Days Till Arrival | Last Payment Date | Last Milestone | Transaction References
```

If you are missing older trip columns (`Pet Details`, `Meal Plan`, `Mixed Meal Plan Details`), insert them in the order shown in the table above so columns line up with the script.

### 2. Update Apps Script

1. Open the sheet → **Extensions → Apps Script**
2. Replace the code with `scripts/google-apps-script.gs` from this repo
3. **Save** (no new deploy needed if the Web App URL is already in Vercel)

### 3. After each Plan My Trip request

1. Find the new row (by email, name, or Submitted At)
2. Enter **Quotation #** (column AM) — same number you give the customer
3. Enter **Tour Amount (USD)** (column AN) — your official quote total

### 4. When the customer pays

They enter that quotation on `/payments`. The site finds the row by **Quotation #** and updates **AO–AV**. The tour amount on the sheet (AN) is what drives % paid — not whatever they type on the payment form.

---

## Matching payments to rows

The script finds the row where **column AM (Quotation #)** equals what the customer entered (case-insensitive).

If payment fails with *"Quotation not found"* → check AM matches exactly.  
If *"Tour Amount missing"* → fill column AN on that row.

---

## Vercel env vars (unchanged)

Same as Plan My Trip — one Web App, one secret:

- `GOOGLE_APPS_SCRIPT_URL`
- `GOOGLE_APPS_SCRIPT_SECRET`

No extra variables for payments.

---

## Email notifications (optional)

Get an email when someone submits **Plan My Trip**, **Share Your Story**, or completes a **payment**.

### Setup

1. Open your sheet → **Extensions → Apps Script**
2. Paste the latest `scripts/google-apps-script.gs` from this repo and **Save**
3. **Project Settings** (gear) → **Script properties** → **Add script property**
   - **Property:** `NOTIFY_EMAIL`
   - **Value:** your email (e.g. `hello@ceylonunscripted.com`)
   - Multiple addresses: separate with commas (`you@example.com, team@example.com`)
   - If omitted, emails go to the Google account that owns the script (see deployment below)
4. **Deploy → Manage deployments** → edit your Web App:
   - **Execute as:** **Me** (your Google account) — **required for email**
   - **Who has access:** Anyone
   - Click **Deploy** (new version if prompted)
5. In the Apps Script editor, select **`authorizeScript`** → **Run ▶** → approve all permissions (Spreadsheet, Drive, **Gmail send**)
6. Select **`testNotificationEmail`** → **Run ▶** → check your inbox (and spam)

### If no email arrives

| Check | What to do |
|-------|------------|
| Script not updated | GitHub push does **not** update Apps Script — paste the latest `.gs` file manually |
| Wrong deployment | Web App must be **Execute as: Me**, not "User accessing the web app" |
| Permissions | Run `authorizeScript` and `testNotificationEmail` once; approve Gmail send access |
| `NOTIFY_EMAIL` typo | Confirm property name is exactly `NOTIFY_EMAIL` |
| Spam folder | Search for subject "New Plan My Trip request" |
| Last error | After a failed send, Script properties may show `LAST_EMAIL_ERROR` |

Trip/review/payment API responses now include a `notification` object (`sent`, `error`, `recipients`) for debugging in Vercel function logs.
