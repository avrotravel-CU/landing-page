import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Mail,
  Download,
} from "lucide-react";
import type { PaymentResultState } from "../types/payment";
import { formatCardDisplay } from "../types/payment";

const NEXT_STEPS = [
  {
    num: 1,
    title: "Email Confirmation",
    text: "You'll receive an instant confirmation email with your payment details.",
  },
  {
    num: 2,
    title: "Payment Receipt",
    text: "A detailed receipt will be sent within 24 hours from our finance team.",
  },
  {
    num: 3,
    title: "Tour Confirmation",
    text: "Our team will confirm all arrangements for your trip.",
  },
  {
    num: 4,
    title: "Itinerary Delivery",
    text: "Your full itinerary and travel documents will follow by email.",
  },
];

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-forest-950/55">{label}</dt>
      <dd className="text-right font-medium text-forest-900">{value}</dd>
    </div>
  );
}

function downloadReceipt(state: PaymentResultState) {
  const { booking, card, transactionRef } = state;
  const lines = [
    "CEYLON UNSCRIPTED — PAYMENT RECEIPT",
    "=".repeat(40),
    "",
    `Transaction Reference: ${transactionRef}`,
    `Date: ${new Date().toLocaleString()}`,
    "",
    "BOOKING DETAILS",
    "-".repeat(40),
    `Name: ${booking.name}`,
    `Quotation: ${booking.quotation}`,
    `Email: ${booking.email}`,
    booking.phone ? `Phone: ${booking.phone}` : "",
    "",
    "PAYMENT DETAILS",
    "-".repeat(40),
    `Method: ${card.method}`,
    `Card: ${formatCardDisplay(card)}`,
    "",
    "Thank you for booking with Ceylon Unscripted.",
    "hello@ceylonunscripted.com",
  ]
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([lines], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${transactionRef}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentResultState | null;

  useEffect(() => {
    if (!state?.booking || !state?.transactionRef) {
      navigate("/payments", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.booking || !state?.transactionRef) return null;

  const maskedCard = formatCardDisplay(state.card);

  return (
    <main className="bg-cream-100">
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-20">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-400/40 bg-forest-800">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Payment Confirmed
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
            Payment successful
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Your booking is confirmed. Sri Lanka is waiting for you.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-10 lg:py-12">
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-forest-950/50">
              Transaction Reference
            </h2>
            <p className="mt-2 font-mono text-lg font-bold text-forest-900">
              {state.transactionRef}
            </p>
            <p className="mt-1 text-xs text-forest-950/50">
              Keep this reference for your records
            </p>
          </div>

          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              Booking Summary
            </h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <SummaryRow label="Booking Name" value={state.booking.name} />
              <SummaryRow label="Quotation Number" value={state.booking.quotation} />
              <SummaryRow
                label="Tour Amount"
                value={`USD ${Number(state.booking.amount).toFixed(2)}`}
              />
              {state.booking.paymentAmount && (
                <SummaryRow
                  label="Amount Paid"
                  value={`USD ${Number(state.booking.paymentAmount).toFixed(2)}`}
                />
              )}
              <SummaryRow label="Email" value={state.booking.email} />
              {state.booking.phone && (
                <SummaryRow label="Phone" value={state.booking.phone} />
              )}
              <SummaryRow label="Payment Method" value={state.card.method} />
              <SummaryRow label="Card Number" value={maskedCard} />
            </dl>
          </div>

          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              What Happens Next?
            </h3>
            <ol className="mt-5 space-y-4">
              {NEXT_STEPS.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                    {s.num}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">
                      {s.title}
                    </p>
                    <p className="text-[13px] leading-relaxed text-forest-950/60">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            onClick={() => downloadReceipt(state)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-forest-900/20 bg-white px-6 py-3 text-sm font-semibold text-forest-900 shadow-sm transition hover:bg-forest-900/5"
          >
            <Download size={16} />
            Download Receipt
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="flex-1 rounded-full border border-forest-900 px-6 py-3 text-center text-sm font-semibold text-forest-900 transition hover:bg-forest-900/5"
            >
              Return Home
            </Link>
            <a
              href="mailto:hello@ceylonunscripted.com"
              className="flex-1 rounded-full bg-gold-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Contact Support
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-gold-50 px-4 py-3 text-xs text-forest-950/60">
            <Mail size={14} className="text-gold-500" />
            Questions? Email us at{" "}
            <a
              href="mailto:hello@ceylonunscripted.com"
              className="font-semibold text-gold-600"
            >
              hello@ceylonunscripted.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
