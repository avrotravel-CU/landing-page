import { JWT } from "google-auth-library";

// Column order in the Google Sheet. "Submitted At" is filled in by the
// server; everything else comes straight from the Plan My Trip form.
const FIELD_ORDER = [
  "Submitted At",
  "First Name",
  "Last Name",
  "Email Address",
  "Phone / WhatsApp",
  "Country of Residence",
  "Preferred Contact Method",
  "Arrival Date",
  "Departure Date",
  "Number of Days",
  "Adults",
  "Infants",
  "Children",
  "Teens",
  "Travelling with Pets",
  "Destinations",
  "Other Destinations",
  "Hotel Rating",
  "Room Types",
  "Activities",
  "Other Activities",
  "Preferred Language",
  "Driver Gender Preference",
  "Preferred Driver Age",
  "LGBTQ Friendly Driver",
  "Child Friendly Driver",
  "Food Preferences",
  "Spice Level",
  "Allergies / Medical",
  "Cultural Preferences",
  "Cultural Details",
  "Budget",
  "Dream Trip",
  "Terms Agreed",
  "Full Trip Request",
];

const SHEET_RANGE = "Sheet1!A1";

function getClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY env vars"
    );
  }
  return new JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.error("Missing GOOGLE_SHEET_ID env var");
    return res.status(500).json({ error: "Server is not configured yet" });
  }

  try {
    const data = req.body && typeof req.body === "object" ? req.body : {};

    const row = FIELD_ORDER.map((key) => {
      if (key === "Submitted At") return new Date().toISOString();
      const value = data[key];
      return value === undefined || value === null ? "" : String(value);
    });

    const client = getClient();
    const { access_token: accessToken } = await client.authorize();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      SHEET_RANGE
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const sheetsResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error("Google Sheets API error:", errorText);
      return res
        .status(502)
        .json({ error: "Failed to save your request. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("submit-trip error:", err);
    return res
      .status(500)
      .json({ error: "Failed to save your request. Please try again." });
  }
}
