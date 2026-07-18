import Stripe from "stripe";
import { isValidPaymentOption } from "./payment-schedule.js";

async function lookupBooking(quotation) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !sharedSecret) return null;

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
  try {
    const parsed = JSON.parse(text);
    return parsed?.ok === true ? parsed : null;
  } catch {
    return null;
  }
}

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
      milestone,
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

    if (!milestone) {
      return res.status(400).json({ error: "Payment milestone is required" });
    }

    const booking = await lookupBooking(String(quotation).trim());
    if (!booking) {
      return res.status(400).json({
        error: "Could not verify booking schedule. Check your quotation number.",
      });
    }

    if (booking.daysTillArrival == null) {
      return res.status(400).json({
        error: "Arrival date is missing for this booking. Contact us to update your quote.",
      });
    }

    const valid = isValidPaymentOption(
      booking.daysTillArrival,
      booking.tourAmount,
      booking.totalPaid,
      String(milestone),
      parsedAmount
    );

    if (!valid) {
      return res.status(400).json({
        error: "This payment amount is not allowed for your booking schedule.",
      });
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
        milestone: String(milestone),
        days_till_arrival: String(booking.daysTillArrival),
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
