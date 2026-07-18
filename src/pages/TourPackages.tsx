import { Link } from "react-router-dom";
import { Clock, Users, Star, ArrowRight } from "lucide-react";
import { tourPackages } from "../data/tourPackages";

export default function TourPackages() {
  return (
    <main>
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            Curated Journeys
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Tour Packages
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            From ancient kingdoms to surf breaks, every corner of Sri Lanka
            holds a story.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tourPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col overflow-hidden rounded-xl border border-gold-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={pkg.image}
                  alt={`${pkg.name} – ${pkg.badge}`}
                  className="h-44 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-4 text-xs text-forest-950/55">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {pkg.days}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {pkg.group}
                    </span>
                    <span className="flex items-center gap-1 text-gold-500">
                      <Star size={13} className="fill-gold-500" />
                      {pkg.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-forest-950/70">
                    {pkg.description}
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {pkg.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-[13px] text-forest-950/70"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-forest-100 pt-4">
                    <span className="text-sm font-bold text-gold-500">
                      {pkg.price}
                    </span>
                    <Link
                      to={`/plan?package=${pkg.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gold-600"
                    >
                      Book This <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-peach-100 px-6 py-10 text-center">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              Don't see exactly what you want?
            </h2>
            <p className="mt-1.5 text-sm text-forest-950/60">
              Every tour we run is built from scratch around you.
            </p>
            <Link
              to="/plan"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Build a Custom Tour <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
