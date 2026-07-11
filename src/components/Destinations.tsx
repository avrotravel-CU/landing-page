import { useState } from "react";
import { destinations, regions, type Region } from "../data/destinations";

export default function Destinations() {
  const [active, setActive] = useState<Region | "All">("All");

  const filtered =
    active === "All"
      ? destinations
      : destinations.filter((d) => d.region === active);

  return (
    <section id="packages" className="bg-cream-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">
            Explore
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-forest-900 sm:text-4xl">
            Top Destinations
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-forest-950/60">
            From ancient kingdoms to surf breaks, every corner of Sri Lanka
            holds a story.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setActive("All")}
            className={
              active === "All"
                ? "rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-medium text-forest-950/70 transition hover:border-gold-400"
            }
          >
            All
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActive(region)}
              className={
                active === region
                  ? "rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-medium text-forest-950/70 transition hover:border-gold-400"
              }
            >
              {region}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => (
            <div
              key={dest.name}
              className="overflow-hidden rounded-xl border border-gold-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-36 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-forest-900">
                  {dest.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-forest-950/40">
                  {dest.region}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-forest-950/65">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
