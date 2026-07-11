import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  User,
  FileText,
  Mail,
  Phone,
  CreditCard,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";

type Step = 1 | 2 | 3;

const PAYMENT_METHODS = [
  { id: "Visa", label: "VISA" },
  { id: "Mastercard", label: "MasterCard" },
  { id: "Amex", label: "AMEX" },
  { id: "Discover", label: "DISCOVER" },
];

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 + i));

const SCHEDULE_STEPS = [
  {
    num: 1,
    title: "Booking Confirmation",
    percent: "25% Deposit",
    timing: "At time of booking",
    desc: "Secures your dates and confirms all arrangements",
  },
  {
    num: 2,
    title: "Pre-Arrival",
    percent: "50% Payment",
    timing: "60 days before travel",
    desc: "Covers accommodation bookings and transport",
  },
  {
    num: 3,
    title: "Final Payment",
    percent: "25% Balance",
    timing: "30 days before travel",
    desc: "Settles all remaining tour costs",
  },
];

const FAQS = [
  {
    q: "What currency should I pay in?",
    a: "We accept payments in USD, EUR, or GBP. All our tour packages are quoted in USD, but we can provide rates in other currencies upon request.",
  },
  {
    q: "When will I receive my payment confirmation?",
    a: "You'll receive an automated confirmation email immediately after your payment is processed, followed by a detailed receipt within 24 hours from our team.",
  },
  {
    q: "What is your cancellation and refund policy?",
    a: "Cancellations 90+ days before travel receive a full refund minus 10% admin fee. 60-89 days: 50% refund. 30-59 days: 25% refund. Less than 30 days: no refund. We recommend travel insurance.",
  },
  {
    q: "Are there any additional fees or charges?",
    a: "The price you see is the price you pay. There are no hidden fees. International transaction fees may apply depending on your bank or payment method.",
  },
  {
    q: "Can I split payment across multiple cards?",
    a: "Yes, we can arrange split payments. Contact us directly and we'll send you separate payment links for each card.",
  },
  {
    q: "Do you offer payment plans for longer tours?",
    a: "For tours over USD 5,000, we can arrange customised payment schedules. Get in touch to discuss options.",
  },
];

const TERMS_SECTIONS = [
  {
    title: "1. Payment Structure",
    text: "Tours are secured with a 25% deposit at the time of booking, followed by a 50% payment due 60 days before travel, and the final 25% balance due 30 days before travel.",
  },
  {
    title: "2. Accepted Currencies",
    text: "We accept payments in USD, EUR, or GBP. Tour packages are quoted in USD by default; rates in other currencies are available upon request.",
  },
  {
    title: "3. Payment Confirmation",
    text: "You will receive an automated confirmation email immediately after your payment is processed, followed by a detailed receipt within 24 hours from our team.",
  },
  {
    title: "4. Cancellation and Refund Policy",
    text: "Cancellations 90+ days before travel receive a full refund minus a 10% admin fee. 60-89 days before travel: 50% refund. 30-59 days: 25% refund. Less than 30 days before travel: no refund. We strongly recommend travel insurance.",
  },
  {
    title: "5. No Hidden Fees",
    text: "The price you see is the price you pay. There are no hidden fees, though international transaction fees may apply depending on your bank or payment method.",
  },
  {
    title: "6. Split Payments",
    text: "Split payments across multiple cards can be arranged on request. Contact us directly and we will send separate payment links for each card used.",
  },
  {
    title: "7. Liability and Third-Party Services",
    text: "Ceylon Unscripted acts as an agent for accommodation providers, transport operators, and activity partners. We are not liable for the acts, omissions, or default of any third-party supplier beyond our reasonable control.",
  },
  {
    title: "8. Changes to Your Booking",
    text: "Requests to amend travel dates, itineraries, or group size are subject to availability and may incur additional charges depending on the change requested.",
  },
  {
    title: "9. Governing Law",
    text: "These terms and any payments made are governed by and construed in accordance with the laws applicable to Ceylon Unscripted's place of operation.",
  },
];

type Booking = {
  name: string;
  quotation: string;
  email: string;
  phone: string;
};

type CardDetails = {
  method: string;
  name: string;
  number: string;
  month: string;
  year: string;
  cvc: string;
};

function Field({
  icon: Icon,
  label,
  optional,
  ...props
}: {
  icon: typeof User;
  label: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-forest-900">
        <Icon size={14} className="text-forest-950/45" />
        {label}
        {optional && (
          <span className="text-xs font-normal text-forest-950/40">
            (Optional)
          </span>
        )}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
      />
    </label>
  );
}

function StepDot({
  num,
  label,
  active,
}: {
  num: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={
          active
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-900 text-xs font-bold text-white"
            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-forest-900/20 text-xs font-bold text-forest-950/35"
        }
      >
        {num}
      </span>
      <span
        className={
          active
            ? "text-sm font-semibold text-forest-900"
            : "text-sm font-medium text-forest-950/40"
        }
      >
        {label}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-forest-950/55">{label}</dt>
      <dd className="text-right font-medium text-forest-900">{value}</dd>
    </div>
  );
}

function NextStep({
  num,
  title,
  text,
}: {
  num: number;
  title: string;
  text: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-600">
        {num}
      </span>
      <div>
        <p className="text-sm font-semibold text-forest-900">{title}</p>
        <p className="text-[13px] leading-relaxed text-forest-950/60">{text}</p>
      </div>
    </li>
  );
}

export default function Payments() {
  const [step, setStep] = useState<Step>(1);
  const [booking, setBooking] = useState<Booking>({
    name: "",
    quotation: "",
    email: "",
    phone: "",
  });
  const [card, setCard] = useState<CardDetails>({
    method: "Visa",
    name: "",
    number: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const step1Valid = Boolean(
    booking.name.trim() && booking.quotation.trim() && booking.email.trim()
  );
  const step2Valid = Boolean(
    card.name.trim() &&
      card.number.trim() &&
      card.month &&
      card.year &&
      card.cvc.trim() &&
      agreed
  );

  function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    if (step1Valid) setStep(2);
  }

  function handleStep2Submit(e: FormEvent) {
    e.preventDefault();
    if (step2Valid) setStep(3);
  }

  return (
    <main className="bg-cream-100">
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            <Shield size={13} /> Secure &amp; Simple
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Payments &amp; Booking
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Transparent pricing, secure payments, and flexible options. Your
            money is protected every step of the way.
          </p>
        </div>
      </section>

      {step !== 3 && (
        <div className="mx-auto flex max-w-md items-center justify-center gap-4 px-6 pt-10">
          <StepDot num={1} label="Verify Booking" active={step >= 1} />
          <span className="h-px w-10 shrink-0 bg-forest-900/15" />
          <StepDot num={2} label="Submit Payment" active={step >= 2} />
        </div>
      )}

      <section>
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-10 lg:py-12">
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
            {step === 1 && (
              <>
                <h2 className="font-serif text-xl font-bold text-forest-900">
                  Verify Your Booking Details
                </h2>
                <p className="mt-1 text-sm text-forest-950/60">
                  Please confirm your booking information before proceeding
                  to payment.
                </p>

                <form onSubmit={handleStep1Submit} className="mt-6 space-y-5">
                  <Field
                    icon={User}
                    label="Booking Name"
                    placeholder="Enter the name associated with your booking"
                    value={booking.name}
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, name: e.target.value }))
                    }
                  />
                  <Field
                    icon={FileText}
                    label="Quotation Number"
                    placeholder="Enter your quotation number (e.g., CU-2026-001)"
                    value={booking.quotation}
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, quotation: e.target.value }))
                    }
                  />
                  <Field
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    value={booking.email}
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, email: e.target.value }))
                    }
                  />
                  <Field
                    icon={Phone}
                    label="Phone Number"
                    optional
                    placeholder="Enter your phone number"
                    value={booking.phone}
                    onChange={(e) =>
                      setBooking((b) => ({ ...b, phone: e.target.value }))
                    }
                  />

                  <button
                    type="submit"
                    disabled={!step1Valid}
                    className="mt-2 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Continue to Payment
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm font-bold text-forest-900">
                  Choose a payment method and click Continue...
                </p>

                <form onSubmit={handleStep2Submit} className="mt-4 space-y-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setCard((c) => ({ ...c, method: m.id }))
                        }
                        className={
                          m.id === card.method
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
                      <h3 className="text-lg font-bold text-blue-600">
                        Credit Card
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-forest-950/70">
                      To pay by credit card, please fill out the fields
                      below.
                    </p>

                    <div className="mt-4 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                          Name on card:
                        </label>
                        <input
                          value={card.name}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, name: e.target.value }))
                          }
                          className="min-w-0 flex-1 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none transition focus:border-blue-400"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                          Card Number:
                        </label>
                        <input
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          value={card.number}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, number: e.target.value }))
                          }
                          className="min-w-0 flex-1 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-blue-400"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                          Expiration Date:
                        </label>
                        <select
                          value={card.month}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, month: e.target.value }))
                          }
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
                          value={card.year}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, year: e.target.value }))
                          }
                          className="rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none transition focus:border-blue-400"
                        >
                          <option value="">Year</option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="w-36 shrink-0 text-sm font-semibold text-forest-900">
                          Security Code:
                        </label>
                        <input
                          placeholder="CVV"
                          inputMode="numeric"
                          value={card.cvc}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, cvc: e.target.value }))
                          }
                          className="w-24 rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-blue-400"
                        />
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

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full border border-forest-900 px-6 py-3 text-sm font-semibold text-forest-900 transition hover:bg-forest-900/5"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!step2Valid}
                      className={
                        step2Valid
                          ? "flex-1 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
                          : "flex-1 cursor-not-allowed rounded-full bg-green-200 px-6 py-3 text-sm font-semibold text-white/90"
                      }
                    >
                      Continue...
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h2 className="mt-5 font-serif text-2xl font-bold text-forest-900">
                  Payment Submitted Successfully!
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-forest-950/60">
                  Thank you, {booking.name || "traveler"}. We've received
                  your payment details and will confirm your booking
                  shortly.
                </p>

                <div className="mt-6 rounded-xl bg-cream-100 p-5 text-left">
                  <h3 className="text-sm font-bold text-forest-900">
                    Booking Summary
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <SummaryRow label="Booking Name" value={booking.name} />
                    <SummaryRow
                      label="Quotation Number"
                      value={booking.quotation}
                    />
                    <SummaryRow label="Email" value={booking.email} />
                    {booking.phone && (
                      <SummaryRow label="Phone" value={booking.phone} />
                    )}
                    <SummaryRow label="Payment Method" value={card.method} />
                    <SummaryRow
                      label="Card Number"
                      value={`•••• •••• •••• ${card.number.slice(-4) || "0000"}`}
                    />
                  </dl>
                </div>

                <div className="mt-6 text-left">
                  <h3 className="text-sm font-bold text-forest-900">
                    What Happens Next?
                  </h3>
                  <ol className="mt-3 space-y-3">
                    <NextStep
                      num={1}
                      title="Email Confirmation"
                      text="You'll receive an instant confirmation email with your payment details."
                    />
                    <NextStep
                      num={2}
                      title="Payment Receipt"
                      text="A detailed receipt will be sent within 24 hours from our finance team."
                    />
                    <NextStep
                      num={3}
                      title="Tour Confirmation"
                      text="Our team will confirm all arrangements for your trip."
                    />
                    <NextStep
                      num={4}
                      title="Itinerary Delivery"
                      text="Your full itinerary and travel documents will follow by email."
                    />
                  </ol>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gold-50 px-4 py-3 text-xs text-forest-950/60">
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
            )}
          </div>

          {step === 2 && (
            <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="rounded-lg border border-forest-900/15">
                <button
                  type="button"
                  onClick={() => setTermsOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-forest-900"
                >
                  Terms and Conditions for Payments
                  {termsOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {termsOpen && (
                  <div className="max-h-64 space-y-3 overflow-y-auto border-t border-forest-900/10 px-4 py-4 text-xs leading-relaxed text-forest-950/70">
                    {TERMS_SECTIONS.map((s) => (
                      <div key={s.title}>
                        <p className="font-semibold text-forest-900">
                          {s.title}
                        </p>
                        <p className="mt-0.5">{s.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="mt-4 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-900/30 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-sm text-forest-950/70">
                  I have read and agree to the Terms and Conditions for
                  Payments
                </span>
              </label>
            </div>
          )}
        </div>
      </section>

      {step !== 3 && (
        <>
          <section>
            <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">
                  Payment Schedule
                </h2>
                <p className="mt-2 text-sm text-forest-950/60">
                  Simple, structured payments to help you plan ahead
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {SCHEDULE_STEPS.map((s) => (
                  <div
                    key={s.title}
                    className="relative rounded-xl border border-gold-100 bg-white p-6 pt-8 shadow-sm"
                  >
                    <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-white">
                      {s.num}
                    </span>
                    <h3 className="text-base font-bold text-forest-900">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm">
                      <span className="font-bold text-gold-500">
                        {s.percent}
                      </span>
                      <span className="text-forest-950/50"> • {s.timing}</span>
                    </p>
                    <p className="mt-2 text-[13px] text-forest-950/60">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 px-5 py-4">
                <Clock size={16} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Flexible Payment Terms
                  </p>
                  <p className="mt-0.5 text-[13px] text-blue-800/80">
                    For bookings made less than 90 days before travel, full
                    payment is required at time of booking. Custom payment
                    schedules available for tours over USD 5,000.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mx-auto max-w-4xl px-6 pb-16 lg:px-10 lg:pb-20">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">
                  Payment Questions
                </h2>
                <p className="mt-2 text-sm text-forest-950/60">
                  Everything you need to know about paying for your tour
                </p>
              </div>

              <div className="mt-10 space-y-4">
                {FAQS.map((f) => (
                  <div
                    key={f.q}
                    className="rounded-xl border border-gold-100 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-sm font-bold text-forest-900">
                      {f.q}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-forest-950/65">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="mx-auto max-w-3xl px-6 pb-16 lg:px-10 lg:pb-20">
              <div className="rounded-2xl bg-peach-100 px-6 py-10 text-center">
                <h2 className="font-serif text-lg font-bold text-forest-900">
                  Ready to Start Planning?
                </h2>
                <p className="mt-1.5 text-sm text-forest-950/60">
                  Submit a tour request and we'll send you a detailed quote
                  with transparent pricing and payment options.
                </p>
                <Link
                  to="/plan"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                >
                  Request a Quote <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
