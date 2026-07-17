# Customer reviews (Share Your Story)

Customers submit reviews on **/experiences** → **Share Your Story**. Published reviews load automatically in **Hear From Our Travelers**.

Uses the **same** Vercel env vars as Plan My Trip:

- `GOOGLE_APPS_SCRIPT_URL`
- `GOOGLE_APPS_SCRIPT_SECRET`

---

## One-time Apps Script setup

1. Open your Google Sheet → **Extensions → Apps Script**.
2. Replace `Code.gs` with the latest `scripts/google-apps-script.gs` from this repo → **Save**.
3. **Run once** in the editor: select function `ensureReviewsSheet` is not exposed — first submit creates the tab. Or add a **Reviews** tab manually with headers:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Submitted At | Name | Country | Visit Month | Visit Year | Rating | Review | Photo URLs | Display on Site |

4. **Deploy → Manage deployments → Edit** your existing Web app → **New version** → **Deploy** (same URL).
5. The first review with photos will ask you to **authorize Google Drive** (stores images in folder **Ceylon Unscripted Review Photos**).

---

## Display on the website

- Column **I — Display on Site**:
  - **`Yes`** → shown on `/experiences`
  - **`No`** or **`Pending`** → hidden

New submissions are saved as **`Yes`** by default (live immediately). To approve reviews first, change `displayStatus` in `submitReview()` in Apps Script from `"Yes"` to `"Pending"`, then set **Yes** manually in the sheet.

---

## Hide or remove a review

Set **Display on Site** to **No** in the **Reviews** tab (or delete the row).

---

## Deploy the website

Push to GitHub so Vercel includes:

- `/api/submit-review`
- `/api/reviews`

Test on the **live** site (not `npm run dev` alone — API routes need Vercel).

---

## Curated reviews

Static cards in `src/data/testimonials.ts` still appear **after** customer reviews. Remove entries there if you only want real submissions.
