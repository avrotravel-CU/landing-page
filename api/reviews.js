// GET published customer reviews for the Experiences page.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !sharedSecret) {
    return res.status(200).json({ reviews: [] });
  }

  try {
    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "listReviews",
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
      console.error("listReviews Apps Script error:", scriptResponse.status, text);
      return res.status(200).json({ reviews: [] });
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ reviews: parsed.reviews ?? [] });
  } catch (err) {
    console.error("reviews error:", err);
    return res.status(200).json({ reviews: [] });
  }
}
