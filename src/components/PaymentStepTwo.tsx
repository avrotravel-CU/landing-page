import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, HelpCircle } from "lucide-react";
import {
  formatUsd,
  getPaymentBreakdown,
  PAYMENT_MILESTONES,
  type PaymentMilestoneId,
} from "../data/paymentMilestones";
import { isStripeConfigured } from "../lib/stripe";
import {
  generateTransactionRef,
  type Booking,
  type CardDetails,
  type PaymentResultState,
} from "../types/payment";
import PaymentSummarySidebar from "./PaymentSummarySidebar";
import { PaymentTermsAccordion, PaymentTermsModal } from "./PaymentTerms";

const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: "14px",
    color: "#1a2e1a",
    fontFamily: "Inter, system-ui, sans-serif",
    "::placeholder": { color: "#1a2e1a55" },
  },
  invalid: { color: "#b91c1c" },
};

const PAYMENT_METHODS = [
  { id: "Visa", label: "VISA" },
  { id: "Mastercard", label: "MasterCard" },
  { id: "Amex", label: "AMEX" },
  { id: "Discover", label: "DISCOVER" },
];

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
];
const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 + i));

type Props = {
  booking: Booking;
  onBack: () => void;
};

function MilestoneSelector({
  tourAmount,
  selected,
  onSelect,
}: {
  tourAmount: number;
  selected: PaymentMilestoneId | null;
  onSelect: (id: PaymentMilestoneId) => void;
}) {
  return (
    <div className="space-y-3">
      {PAYMENT_MILESTONES.map((milestone) => {
        const amount = tourAmount * milestone.percent;
        const active = selected === milestone.id;

        return (
          <button
            key={milestone.id}
            type="button"
            onClick={() => onSelect(milestone.id)}
            className={
              active
                ? "flex w-full items-center justify-between rounded-lg border border-forest-900/15 border-l-4 border-l-forest-900 bg-forest-900/[0.04] px-4 py-3 text-left transition"
                : "flex w-full items-center justify-between rounded-lg border border-forest-900/15 border-l-4 border-l-transparent bg-white px-4 py-3 text-left transition hover:border-forest-900/25"
            }
          >
            <div>
              <p className="text-sm font-semibold text-forest-900">
                {milestone.label}
              </p>
              <p className="text-xs text-forest-950/50">{milestone.timing}</p>
            </div>
            <p className="text-sm font-bold text-forest-900">
              {formatUsd(amount)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default function PaymentStepTwo({ booking, onBack }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const stripeReady = isStripeConfigured();

  const [method, setMethod] = useState("Visa");
  const [milestoneId, setMilestoneId] = useState<PaymentMilestoneId | null>(
    null
  );
  const [nameOnCard, setNameOnCard] = useState(booking.name);
  const [cardNumber, setCardNumber] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const tourAmount = Number(booking.amount) || 0;
  const breakdown = milestoneId
    ? getPaymentBreakdown(tourAmount, milestoneId)
    : null;

  const nativeCardValid = Boolean(
    nameOnCard.trim() &&
      cardNumber.trim() &&
      cardMonth &&
      cardYear &&
      cardCvc.trim()
  );

  const stripeCardValid = Boolean(stripe && elements && nameOnCard.trim());
  const cardValid = stripeReady ? stripeCardValid : nativeCardValid;
  const formReady = Boolean(milestoneId && cardValid && !processing);
  const canSubmit = formReady && agreed;

  function buildResult(card: CardDetails): PaymentResultState {
    return {
      booking: {
        ...booking,
        milestoneId: milestoneId ?? undefined,
        paymentAmount: breakdown?.paymentAmount.toFixed(2),
      },
      card,
      transactionRef: generateTransactionRef(),
    };
  }

  async function processStripePayment() {
    if (!stripe || !elements || !breakdown) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Card form is not ready. Please refresh and try again.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const intentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: breakdown.paymentAmount,
          currency: booking.currency,
          quotation: booking.quotation,
          email: booking.email,
          name: booking.name,
          phone: booking.phone,
          milestone: milestoneId,
        }),
      });

      const intentData = await intentResponse.json();
      if (!intentResponse.ok) {
        throw new Error(intentData.error || "Failed to start payment");
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: nameOnCard,
              email: booking.email,
              phone: booking.phone || undefined,
            },
          },
        });

      const result = buildResult({
        method,
        name: nameOnCard,
        number: "",
        month: "",
        year: "",
        cvc: "",
        last4: "****",
      });
      result.stripePaymentIntentId =
        paymentIntent?.id ?? intentData.paymentIntentId;

      if (confirmError || paymentIntent?.status !== "succeeded") {
        navigate("/payment-declined", { state: result });
        return;
      }

      navigate("/payment-success", { state: result });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  function processDemoPayment() {
    if (!breakdown) return;

    const result = buildResult({
      method,
      name: nameOnCard,
      number: cardNumber,
      month: cardMonth,
      year: cardYear,
      cvc: cardCvc,
      last4: cardNumber.replace(/\D/g, "").slice(-4) || "0000",
    });

    const digits = cardNumber.replace(/\D/g, "");
    if (digits.endsWith("0002")) {
      navigate("/payment-declined", { state: result });
      return;
    }

    navigate("/payment-success", { state: result });
  }

  async function processPayment() {
    if (stripeReady) {
      await processStripePayment();
      return;
    }
    processDemoPayment();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formReady) return;

    if (!agreed) {
      setTermsModalOpen(true);
      return;
    }

    void processPayment();
  }

  function handleTermsAccept() {
    setAgreed(true);
    setTermsModalOpen(false);
    if (milestoneId && cardValid) {
      void processPayment();
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold text-forest-900">
            Choose a payment method and click Continue...
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <MilestoneSelector
              tourAmount={tourAmount}
              selected={milestoneId}
              onSelect={setMilestoneId}
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={
                    m.id === method
                      ? "rounded-lg border-2 border-blue-500 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700"
                      : "rounded-lg border border-forest-900/15 bg-white px-3 py-2.5 text-sm font-bold text-forest-950/70 transition hover:border-forest-900/30"
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-forest-900/15 p-5">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-blue-600">Credit Card</h3>
              </div>
              <p className="mt-3 text-sm text-forest-950/70">
                To pay by credit card, please fill out the fields below.
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                    Name on card:
                  </label>
                  <input
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none transition focus:border-blue-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                    Card Number:
                  </label>
                  {stripeReady ? (
                    <div className="min-w-0 flex-1 rounded-lg border border-forest-900/15 px-3 py-2.5">
                      <CardNumberElement
                        options={{ style: STRIPE_ELEMENT_STYLE }}
                      />
                    </div>
                  ) : (
                    <input
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-blue-400"
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                    Expiration Date:
                  </label>
                  {stripeReady ? (
                    <div className="rounded-lg border border-forest-900/15 px-3 py-2.5">
                      <CardExpiryElement
                        options={{ style: STRIPE_ELEMENT_STYLE }}
                      />
                    </div>
                  ) : (
                    <>
                      <select
                        value={cardMonth}
                        onChange={(e) => setCardMonth(e.target.value)}
                        className="rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none transition focus:border-blue-400"
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cardYear}
                        onChange={(e) => setCardYear(e.target.value)}
                        className="rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none transition focus:border-blue-400"
                      >
                        <option value="">Year</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                    Security Code:
                  </label>
                  {stripeReady ? (
                    <div className="w-24 rounded-lg border border-forest-900/15 px-3 py-2.5">
                      <CardCvcElement options={{ style: STRIPE_ELEMENT_STYLE }} />
                    </div>
                  ) : (
                    <input
                      placeholder="CVV"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-24 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-blue-400"
                    />
                  )}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <HelpCircle size={14} /> help
                  </a>
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onBack}
                disabled={processing}
                className="flex-1 rounded-full border border-forest-900 px-6 py-3 text-sm font-semibold text-forest-900 transition hover:bg-forest-900/5 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formReady}
                className={
                  formReady
                    ? canSubmit
                      ? "flex-1 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
                      : "flex-1 rounded-full bg-green-200 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-green-300"
                    : "flex-1 cursor-not-allowed rounded-full bg-green-200 px-6 py-3 text-sm font-semibold text-white/90"
                }
              >
                {processing ? "Processing..." : "Continue..."}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
          <PaymentTermsAccordion
            open={termsOpen}
            onToggle={() => setTermsOpen((v) => !v)}
          />

          <label className="mt-4 flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-900/30 text-gold-500 focus:ring-gold-400"
            />
            <span className="text-sm text-forest-950/70">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className="font-semibold text-gold-600 underline-offset-2 hover:underline"
              >
                Terms and Conditions for Payments
              </button>
            </span>
          </label>
        </div>

        <PaymentTermsModal
          open={termsModalOpen}
          onClose={() => setTermsModalOpen(false)}
          onAccept={handleTermsAccept}
        />
      </div>

      <PaymentSummarySidebar booking={booking} milestoneId={milestoneId} />
    </div>
  );
}
