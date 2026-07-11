import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section id="plan" className="bg-peach-100">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center lg:py-20">
        <h2 className="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">
          Ready to Feel It. Live It. Love It?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-forest-950/60">
          Tell us about your dream trip and we'll create a bespoke Sri Lanka
          itinerary just for you.
        </p>
        <div className="mt-7 flex justify-center">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
          >
            Start Planning <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
