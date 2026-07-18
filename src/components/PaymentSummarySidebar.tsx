import { formatUsd } from "../data/paymentMilestones";
import type { PaymentOption } from "../lib/paymentSchedule";
import type { Booking } from "../types/payment";

type Props = {
  booking: Booking;
  selectedOption: PaymentOption | null;
};

export default function PaymentSummarySidebar({ booking, selectedOption }: Props) {
  const tourAmount = Number(booking.amount) || 0;

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
        {booking.daysTillArrival != null && (
          <p className="mt-1 text-xs text-forest-950/55">
            {booking.daysTillArrival} days until arrival
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gold-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-950/45">
          This Payment
        </p>
        <p className="mt-2 font-serif text-xl font-bold text-forest-900">
          {selectedOption ? formatUsd(selectedOption.paymentAmount) : "—"}
        </p>
        <p className="mt-1 text-xs text-forest-950/55">
          {selectedOption ? selectedOption.label : "Select a payment option"}
        </p>
      </div>

      <div
        className={
          selectedOption?.isFullyPaid
            ? "rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm"
            : "rounded-xl border border-gold-100 bg-white p-4 shadow-sm"
        }
      >
        <p
          className={
            selectedOption?.isFullyPaid
              ? "text-xs font-semibold uppercase tracking-wide text-green-700"
              : "text-xs font-semibold uppercase tracking-wide text-forest-950/45"
          }
        >
          Remaining After
        </p>
        {selectedOption?.isFullyPaid ? (
          <p className="mt-2 font-serif text-xl font-bold text-green-700">
            Fully paid
          </p>
        ) : (
          <>
            <p className="mt-2 font-serif text-xl font-bold text-forest-900">
              {selectedOption ? formatUsd(selectedOption.remaining) : "—"}
            </p>
            <p className="mt-1 text-xs text-forest-950/55">
              {selectedOption ? "Outstanding balance" : "Select a payment option"}
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
