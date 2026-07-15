import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("Missing STRIPE_SECRET_KEY env var");
    return res.status(500).json({ error: "Payment server is not configured yet" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const {
      amount,
      currency = "usd",
      quotation,
      email,
      name,
      phone,
    } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ error: "A valid payment amount is required" });
    }

    if (!quotation || !email || !name) {
      return res
        .status(400)
        .json({ error: "Booking name, quotation, and email are required" });
    }

    const stripe = new Stripe(secretKey);
    const amountInCents = Math.round(parsedAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      receipt_email: email,
      metadata: {
        quotation: String(quotation),
        booking_name: String(name),
        phone: phone ? String(phone) : "",
      },
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    return res.status(500).json({ error: "Failed to start payment. Please try again." });
  }
}
