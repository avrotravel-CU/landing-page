import { Lightbulb, Sparkles } from "lucide-react";
import logoPrimary from "../assets/ideadate/logo-primary.png";
import typefaceLight from "../assets/ideadate/typeface-light.png";

const IDEA_DATE_URL = "https://www.ideadate.app";

export default function IdeaDateBottomBanner() {
  return (
    <aside
      className="ideadate-banner-float pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
      role="complementary"
      aria-label="IdeaDate promotion"
    >
      <div className="pointer-events-auto mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-gold-400/35 shadow-2xl shadow-forest-950/35">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950" />
          <div className="ideadate-banner-shimmer absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

          <div className="relative flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3 sm:shrink-0">
              <div className="ideadate-banner-logo relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-gold-400/60 sm:h-14 sm:w-14">
                <img
                  src={logoPrimary}
                  alt=""
                  className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                />
              </div>
              <img
                src={typefaceLight}
                alt="IdeaDate"
                className="h-5 w-auto object-contain sm:h-6"
              />
            </div>

            <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
              <Sparkles
                className="mt-0.5 hidden h-4 w-4 shrink-0 text-gold-400 sm:block"
                aria-hidden="true"
              />
              <p className="text-sm leading-snug text-white/90 sm:text-[15px]">
                <span className="font-semibold text-gold-300">
                  Got a business idea?
                </span>{" "}
                Looking for a business to invest?{" "}
                <span className="text-white/70">Visit</span>{" "}
                <a
                  href={IDEA_DATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold-400 underline decoration-gold-400/40 underline-offset-2 transition hover:text-gold-300"
                >
                  ideadate.app
                </a>
              </p>
            </div>

            <a
              href={IDEA_DATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ideadate-banner-cta inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-forest-950 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 sm:w-auto"
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Explore IdeaDate
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
