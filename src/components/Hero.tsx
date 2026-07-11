import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroPoster from "../assets/hero-poster.jpg";

export default function Hero() {
  return (
    <section id="home" className="bg-forest-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div>
          <h1 className="font-serif text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
            Real Places.
            <br />
            Real People.
            <br />
            Real Ceylon.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-forest-100/90">
            Discover Sri Lanka beyond the guidebook. Your journey is shaped
            around you, never the brochure version of you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Plan My Trip <ArrowRight size={16} />
            </Link>
            <Link
              to="/tour-packages"
              className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Packages
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src={heroPoster}
            alt="Ceylon Unscripted — Real Places. Real People. Real Ceylon."
            className="aspect-square w-full max-w-[320px] rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
