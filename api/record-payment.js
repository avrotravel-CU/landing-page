// Records a successful payment against the matching Plan My Trip row on Sheet1
// (same Google Sheet + Apps Script Web App as /api/submit-trip).

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
    const paymentAmount = Number(body.paymentAmount);

    if (!quotation) {
      return res.status(400).json({ error: "Quotation number is required" });
    }
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ error: "A valid payment amount is required" });
    }

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "recordPayment",
        secret: sharedSecret,
        quotation,
        paymentAmount,
        milestone: body.milestone,
        milestoneLabel: body.milestoneLabel,
        name: body.name,
        email: body.email,
        transactionRef: body.transactionRef,
        stripePaymentIntentId: body.stripePaymentIntentId,
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
      console.error("Apps Script payment error:", scriptResponse.status, text);
      return res.status(502).json({
        error: parsed?.error || "Failed to update the bookings sheet",
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("record-payment error:", err);
    return res.status(500).json({ error: "Failed to record payment" });
  }
}
