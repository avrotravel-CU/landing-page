import { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import {
  Shield,
  User,
  FileText,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import PaymentStepTwo from "../components/PaymentStepTwo";
import { getStripe } from "../lib/stripe";
import type { Booking, CardDetails } from "../types/payment";

type Step = 1 | 2;

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

export default function Payments() {
  const navigate = useNavigate();
  const location = useLocation();
  const restored = location.state as
    | { step?: Step; booking?: Booking; card?: CardDetails }
    | null;

  const [step, setStep] = useState<Step>(restored?.step ?? 1);
  const [booking, setBooking] = useState<Booking>(
    restored?.booking ?? {
      name: "",
      quotation: "",
      email: "",
      phone: "",
      amount: "",
      currency: "usd",
    }
  );

  useEffect(() => {
    if (restored?.step) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [restored?.step, navigate, location.pathname]);

  const stripePromise = getStripe();

  const step1Valid = Boolean(
    booking.name.trim() &&
      booking.quotation.trim() &&
      booking.email.trim() &&
      booking.amount.trim() &&
      Number(booking.amount) > 0
  );

  function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    if (step1Valid) setStep(2);
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

      <div className="mx-auto flex max-w-md items-center justify-center gap-4 px-6 pt-10">
        <StepDot num={1} label="Verify Booking" active={step >= 1} />
        <span className="h-px w-10 shrink-0 bg-forest-900/15" />
        <StepDot num={2} label="Submit Payment" active={step >= 2} />
      </div>

      <section>
        <div
          className={
            step === 2
              ? "mx-auto max-w-5xl space-y-6 px-6 py-10 lg:py-12"
              : "mx-auto max-w-2xl space-y-6 px-6 py-10 lg:py-12"
          }
        >
          {step === 1 && (
            <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-xl font-bold text-forest-900">
                Verify Your Booking Details
              </h2>
              <p className="mt-1 text-sm text-forest-950/60">
                Please confirm your booking information before proceeding to
                payment.
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
                <Field
                  icon={DollarSign}
                  label="Payment Amount (USD)"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter the amount from your quotation"
                  value={booking.amount}
                  onChange={(e) =>
                    setBooking((b) => ({ ...b, amount: e.target.value }))
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
            </div>
          )}

          {step === 2 && (
            <Elements stripe={stripePromise}>
              <PaymentStepTwo
                booking={booking}
                onBack={() => setStep(1)}
              />
            </Elements>
          )}
        </div>
      </section>

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
    </main>
  );
}
