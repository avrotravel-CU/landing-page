import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ShareYourStory from "../components/ShareYourStory";
import TravelerReviewCard from "../components/TravelerReviewCard";
import {
  experiences,
  experienceCategories,
  categoryBadgeStyles,
  type ExperienceCategory,
} from "../data/experiences";
import { testimonials, type Testimonial } from "../data/testimonials";
import type { CustomerReview } from "../types/review";

function mapCustomerReview(r: CustomerReview): Testimonial {
  return {
    id: r.id,
    name: r.name,
    location: r.location,
    visited: r.visited.trim(),
    quote: r.quote,
    rating: r.rating,
    photos: r.photos,
  };
}

export default function Experiences() {
  const [active, setActive] = useState<ExperienceCategory | "All">("All");
  const [customerReviews, setCustomerReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: { reviews?: CustomerReview[] }) => {
        if (cancelled) return;
        setCustomerReviews(
          data.reviews?.length ? data.reviews.map(mapCustomerReview) : []
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function refreshReviews() {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: { reviews?: CustomerReview[] }) => {
        setCustomerReviews(
          data.reviews?.length ? data.reviews.map(mapCustomerReview) : []
        );
      })
      .catch(() => {});
  }

  const displayedReviews = [...customerReviews, ...testimonials];

  const filtered =
    active === "All"
      ? experiences
      : experiences.filter((e) => e.category === active);

  return (
    <main>
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            LIVE IT
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Experiences
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Moments that become memories. Hand-picked experiences beyond the
            ordinary.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="flex flex-wrap justify-start gap-2.5 lg:justify-center">
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
            {experienceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={
                  active === cat
                    ? "rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-medium text-forest-950/70 transition hover:border-gold-400"
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((exp) => (
              <div
                key={exp.name}
                className="overflow-hidden rounded-xl border border-gold-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={exp.image}
                  alt={exp.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${categoryBadgeStyles[exp.category]}`}
                  >
                    {exp.category}
                  </span>
                  <h3 className="mt-2 font-serif text-base font-bold text-forest-900">
                    {exp.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-forest-950/65">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">
              Hear From Our Travelers
            </h2>
            <p className="mt-2 text-sm text-forest-950/60">
              Real experiences from real people
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {displayedReviews.map((t) => (
              <TravelerReviewCard key={t.id ?? t.name} review={t} />
            ))}
          </div>

          <ShareYourStory onSubmitted={refreshReviews} />

          <div className="mt-12 rounded-2xl bg-peach-100 px-6 py-10 text-center">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              Want to combine experiences into your trip?
            </h2>
            <p className="mt-1.5 text-sm text-forest-950/60">
              Tell us what excites you and we'll weave it all together.
            </p>
            <Link
              to="/plan"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
            >
              Plan My Experience <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
