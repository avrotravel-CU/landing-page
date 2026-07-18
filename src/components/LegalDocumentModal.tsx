import { createPortal } from "react-dom";
import type { TermsSection } from "../types/legal";
import LegalSectionsContent from "./LegalSectionsContent";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  intro?: string;
  sections: TermsSection[];
};

export default function LegalDocumentModal({
  open,
  onClose,
  title,
  subtitle,
  intro,
  sections,
}: Props) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-forest-950/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-document-title"
        className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gold-100 bg-white shadow-xl"
      >
        <div className="border-b border-forest-900/10 px-6 py-4">
          <h2
            id="legal-document-title"
            className="font-serif text-lg font-bold text-forest-900"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-forest-950/60">{subtitle}</p>
          )}
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {intro && (
            <p className="mb-4 text-sm leading-relaxed text-forest-950/70">
              {intro}
            </p>
          )}
          <LegalSectionsContent sections={sections} />
        </div>

        <div className="border-t border-forest-900/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
