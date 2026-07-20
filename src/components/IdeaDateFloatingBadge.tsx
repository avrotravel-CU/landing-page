import { useEffect, useState } from "react";
import { X } from "lucide-react";
import logoPrimary from "../assets/ideadate/logo-primary.png";
import typefaceDark from "../assets/ideadate/typeface-dark.png";

const IDEA_DATE_URL = "https://www.ideadate.app";
const DISMISS_KEY = "ideadate-badge-dismissed-until";
const DISMISS_DAYS = 7;

function isDismissed() {
  try {
    const until = localStorage.getItem(DISMISS_KEY);
    if (!until) return false;
    return Date.now() < Number(until);
  } catch {
    return false;
  }
}

function dismissForWeek() {
  try {
    localStorage.setItem(
      DISMISS_KEY,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000)
    );
  } catch {
    // ignore storage failures
  }
}

export default function IdeaDateFloatingBadge() {
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHidden(isDismissed());
  }, []);

  if (hidden) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-4 z-40 flex items-end justify-end sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2 sm:items-center"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3">
        <div
          className={`origin-right transition-all duration-300 ease-out ${
            open
              ? "max-w-[min(18rem,calc(100vw-5.5rem))] translate-x-0 scale-100 opacity-100"
              : "max-w-0 translate-x-3 scale-95 opacity-0"
          } overflow-hidden`}
          aria-hidden={!open}
        >
          <div className="w-[min(18rem,calc(100vw-5.5rem))] rounded-2xl border border-gold-200 bg-white p-4 shadow-xl shadow-forest-900/10">
            <div className="mb-3 flex items-start justify-between gap-2">
              <img
                src={typefaceDark}
                alt="IdeaDate"
                className="h-5 w-auto object-contain"
              />
              <button
                type="button"
                aria-label="Dismiss IdeaDate badge for one week"
                className="rounded-full p-1 text-forest-900/45 transition hover:bg-forest-50 hover:text-forest-900"
                onClick={() => {
                  dismissForWeek();
                  setHidden(true);
                  setOpen(false);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-forest-950/80">
              Got a business idea? Looking for a business to invest?
            </p>

            <a
              href={IDEA_DATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-800"
            >
              Visit ideadate.app
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          aria-label={open ? "Close IdeaDate promotion" : "Open IdeaDate promotion"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ideadate-badge-motion group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-lg shadow-gold-500/25 ring-2 ring-gold-400/70 transition hover:scale-105 hover:ring-gold-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 sm:h-16 sm:w-16"
        >
          <span className="ideadate-badge-ring absolute inset-0 rounded-full" aria-hidden="true" />
          <img
            src={logoPrimary}
            alt=""
            className="relative h-11 w-11 object-contain sm:h-12 sm:w-12"
          />
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="ideadate-badge-dot absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-500" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
