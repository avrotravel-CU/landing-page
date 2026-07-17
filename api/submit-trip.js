// Forwards Plan My Trip submissions to a Google Apps Script Web App bound
// to the destination Google Sheet. This avoids needing a Google Cloud
// service account: the script lives inside the Sheet itself
// (Extensions -> Apps Script) and appends a row on each request.
//
// This function exists mainly so the Apps Script URL never has to be
// exposed to the browser (it's just an env var on the server), and so we
// can read back a real success/error response instead of relying on
// no-cors "fire and forget" requests from the client.

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
    return res.status(500).json({ error: "Server is not configured yet" });
  }

  try {
    const data = req.body && typeof req.body === "object" ? req.body : {};

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Apps Script Web Apps follow a redirect on POST; fetch follows
      // redirects by default, so this resolves to the final JSON response.
      // The "secret" acts as a private API key: the deployment itself has
      // to allow "Anyone" (so this server-to-server call is accepted at
      // all), but the script rejects any request that doesn't include the
      // matching secret, so it isn't really open to the public.
      body: JSON.stringify({
        action: "submitTrip",
        ...data,
        secret: sharedSecret,
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
      console.error("Apps Script error:", scriptResponse.status, text);
      const detail =
        parsed?.error ||
        (text && text.length < 200 ? text : null) ||
        "Failed to save your request. Please try again.";
      return res.status(502).json({ error: detail });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("submit-trip error:", err);
    return res
      .status(500)
      .json({ error: "Failed to save your request. Please try again." });
  }
}
