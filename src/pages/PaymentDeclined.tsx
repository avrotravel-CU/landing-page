import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { XCircle, Mail, Phone, RefreshCw, CreditCard } from "lucide-react";
import type { PaymentResultState } from "../types/payment";

const DECLINE_REASONS = [
  "Insufficient funds on the card",
  "Card expired or incorrect expiry date",
  "Incorrect security code (CVV)",
  "Bank declined the transaction for security",
  "International payments blocked by your bank",
];

export default function PaymentDeclined() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentResultState | null;

  useEffect(() => {
    if (!state?.booking) {
      navigate("/payments", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.booking) return null;

  return (
    <main className="bg-cream-100">
      <section className="bg-[#5c2020]">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-20">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-300/30 bg-[#4a1818]">
            <XCircle size={40} className="text-red-300" />
          </div>
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            Payment Failed
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
            Payment Declined
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Don&apos;t worry — your booking details are saved. Let&apos;s get
            this sorted.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-10 lg:py-12">
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              Common Reasons
            </h2>
            <ul className="mt-4 space-y-2.5">
              {DECLINE_REASONS.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2.5 text-sm text-forest-950/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              What would you like to do?
            </h3>
            <div className="mt-5 space-y-3">
              <Link
                to="/payments"
                state={{ step: 2, booking: state.booking, card: state.card }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
              >
                <RefreshCw size={16} />
                Try Again
              </Link>
              <a
                href="mailto:hello@ceylonunscripted.com"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest-900 px-6 py-3 text-sm font-semibold text-forest-900 transition hover:bg-forest-900/5"
              >
                <Mail size={16} />
                Contact Our Team
              </a>
              <Link
                to="/payments"
                state={{ step: 2, booking: state.booking }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-6 py-3 text-sm font-semibold text-forest-900 transition hover:bg-gold-100"
              >
                <CreditCard size={16} />
                Try a Different Card
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              Need Help?
            </h3>
            <div className="mt-4 space-y-3 text-sm text-forest-950/70">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-gold-500" />
                <a
                  href="mailto:hello@ceylonunscripted.com"
                  className="font-medium text-gold-600 hover:underline"
                >
                  hello@ceylonunscripted.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-gold-500" />
                +94 11 234 5678
              </p>
            </div>
            <p className="mt-4 text-xs text-forest-950/50">
              Booking saved for: {state.booking.name} ({state.booking.quotation})
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
