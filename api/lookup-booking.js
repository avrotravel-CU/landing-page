// Looks up booking + payment status from Google Sheet by quotation number.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !sharedSecret) {
    console.error(
      "Missing GOOGLE_APPS_SCRIPT_URL or GOOGLE_APPS_SCRIPT_SECRET env vars"
    );
    return res.status(500).json({ error: "Google Sheet is not configured yet" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const quotation = String(body.quotation || "").trim();

    if (!quotation) {
      return res.status(400).json({ error: "Quotation number is required" });
    }

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "lookupBooking",
        secret: sharedSecret,
        quotation,
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
      return res.status(502).json({
        error: parsed?.error || "Failed to look up booking",
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("lookup-booking error:", err);
    return res.status(500).json({ error: "Failed to look up booking" });
  }
}
