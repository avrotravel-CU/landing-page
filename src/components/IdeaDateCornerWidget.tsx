import logoWhiteYellow from "../assets/ideadate/logo-white-yellow.png";

const IDEA_DATE_URL = "https://www.ideadate.app";

export default function IdeaDateCornerWidget() {
  return (
    <aside
      className="ideadate-chat-float pointer-events-none fixed bottom-4 right-4 z-40 max-w-[min(20rem,calc(100vw-2rem))] sm:bottom-5 sm:right-5 sm:max-w-xs"
      role="complementary"
      aria-label="IdeaDate promotion"
    >
      <a
        href={IDEA_DATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ideadate-chat-card pointer-events-auto group relative block rounded-2xl rounded-br-md border border-gold-100 bg-white px-3 py-2.5 shadow-lg shadow-forest-900/10 transition hover:border-gold-300 hover:shadow-xl"
      >
        <div className="flex items-start gap-2.5">
          <img
            src={logoWhiteYellow}
            alt="IdeaDate"
            className="ideadate-chat-logo mt-0.5 h-9 w-9 shrink-0 object-contain"
          />
          <div className="min-w-0 pt-0.5">
            <p className="text-[11px] leading-snug text-forest-950/85 sm:text-xs">
              <span className="font-semibold text-forest-900">Got a business idea?</span>{" "}
              Looking for a business to invest?
            </p>
            <p className="mt-1 text-[11px] font-semibold text-gold-600 transition group-hover:text-gold-500 sm:text-xs">
              Visit ideadate.app →
            </p>
          </div>
        </div>

        <span
          className="absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 border-b border-r border-gold-100 bg-white transition group-hover:border-gold-300"
          aria-hidden="true"
        />
      </a>
    </aside>
  );
}
