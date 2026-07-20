// POST customer reviews (Share Your Story) to Google Sheet + Drive photos.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !sharedSecret) {
    return res.status(500).json({ error: "Reviews are not configured yet" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const name = String(body.name || "").trim();
    const country = String(body.country || "").trim();
    const month = String(body.month || "").trim();
    const year = String(body.year || "").trim();
    const rating = Number(body.rating);
    const review = String(body.review || "").trim();
    const photos = Array.isArray(body.photos) ? body.photos : [];

    if (!name || !country || !month || !year || !review) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Please select a star rating" });
    }
    if (photos.length > 5) {
      return res.status(400).json({ error: "Maximum 5 photos allowed" });
    }

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submitReview",
        secret: sharedSecret,
        name,
        country,
        month,
        year,
        rating,
        review,
        photos,
      }),
    });

    const text = await scriptResponse.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (!scriptResponse.ok || !parsed || parsed.ok !== true) {
      console.error("submitReview Apps Script error:", scriptResponse.status, text);
      return res.status(502).json({
        error: parsed?.error || "Could not save your review. Please try again.",
      });
    }

    if (parsed.notification && parsed.notification.sent !== true) {
      console.warn("Review saved but notification email failed:", parsed.notification);
    }

    return res.status(200).json({ ok: true, displayStatus: parsed.displayStatus });
  } catch (err) {
    console.error("submit-review error:", err);
    return res.status(500).json({ error: "Could not save your review" });
  }
}
