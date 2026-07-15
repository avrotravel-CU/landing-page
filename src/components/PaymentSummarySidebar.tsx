import {
  formatUsd,
  getPaymentBreakdown,
  type PaymentMilestoneId,
} from "../data/paymentMilestones";
import type { Booking } from "../types/payment";

type Props = {
  booking: Booking;
  milestoneId: PaymentMilestoneId | null;
};

export default function PaymentSummarySidebar({ booking, milestoneId }: Props) {
  const tourAmount = Number(booking.amount) || 0;
  const breakdown = milestoneId
    ? getPaymentBreakdown(tourAmount, milestoneId)
    : null;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-xl border border-gold-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-950/45">
          Tour Quotation
        </p>
        <p className="mt-2 font-serif text-xl font-bold text-forest-900">
          {formatUsd(tourAmount)}
        </p>
        <p className="mt-1 text-xs text-forest-950/55">
          Ref: {booking.quotation || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-gold-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-950/45">
          This Payment
        </p>
        <p className="mt-2 font-serif text-xl font-bold text-forest-900">
          {breakdown ? formatUsd(breakdown.paymentAmount) : "—"}
        </p>
        <p className="mt-1 text-xs text-forest-950/55">
          {breakdown ? breakdown.milestone.label : "Select a payment milestone"}
        </p>
      </div>

      <div
        className={
          breakdown?.isFullyPaid
            ? "rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm"
            : "rounded-xl border border-gold-100 bg-white p-4 shadow-sm"
        }
      >
        <p
          className={
            breakdown?.isFullyPaid
              ? "text-xs font-semibold uppercase tracking-wide text-green-700"
              : "text-xs font-semibold uppercase tracking-wide text-forest-950/45"
          }
        >
          Remaining After
        </p>
        {breakdown?.isFullyPaid ? (
          <p className="mt-2 font-serif text-xl font-bold text-green-700">
            Fully paid
          </p>
        ) : (
          <>
            <p className="mt-2 font-serif text-xl font-bold text-forest-900">
              {breakdown ? formatUsd(breakdown.remaining) : "—"}
            </p>
            <p className="mt-1 text-xs text-forest-950/55">
              {breakdown ? "Outstanding balance" : "Select a milestone"}
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
