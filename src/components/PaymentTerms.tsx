import {
  PAYMENT_TERMS_SECTIONS,
  PAYMENT_TERMS_TITLE,
} from "../data/paymentTerms";
import LegalSectionsContent from "./LegalSectionsContent";

export function PaymentTermsAccordion({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border border-forest-900/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-serif text-sm font-semibold text-forest-900"
      >
        {PAYMENT_TERMS_TITLE}
        <span className="text-forest-950/50">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="max-h-72 overflow-y-auto border-t border-forest-900/10 px-4 py-4">
          <LegalSectionsContent sections={PAYMENT_TERMS_SECTIONS} compact />
        </div>
      )}
    </div>
  );
}

export function PaymentTermsModal({
  open,
  onClose,
  onAccept,
}: {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close terms dialog"
        className="absolute inset-0 bg-forest-950/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-terms-title"
        className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gold-100 bg-white shadow-xl"
      >
        <div className="border-b border-forest-900/10 px-6 py-4">
          <h2
            id="payment-terms-title"
            className="font-serif text-lg font-bold text-forest-900"
          >
            {PAYMENT_TERMS_TITLE}
          </h2>
          <p className="mt-1 text-sm text-forest-950/60">
            Please read and accept these terms before proceeding with payment.
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <LegalSectionsContent sections={PAYMENT_TERMS_SECTIONS} />
        </div>

        <div className="flex flex-col gap-3 border-t border-forest-900/10 px-6 py-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-forest-900 px-6 py-3 text-sm font-semibold text-forest-900 transition hover:bg-forest-900/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
          >
            I Agree — Proceed with Payment
          </button>
        </div>
      </div>
    </div>
  );
}
