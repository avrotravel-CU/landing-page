import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search, Star } from "lucide-react";
import type { Testimonial } from "../data/testimonials";
import ReviewPhoto from "./ReviewPhoto";

const PAGE_SIZE = 5;

type SortOption = "relevant" | "newest" | "rating";

function reviewSummary(reviews: Testimonial[]) {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}

function ratingDistribution(reviews: Testimonial[]) {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const stars = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[stars] += 1;
  }
  return ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: counts[stars],
  }));
}

function formatReviewDate(review: Testimonial): string {
  if (review.submittedAt) {
    const d = new Date(review.submittedAt);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
    }
  }
  return review.visited ?? "";
}

function reviewSortKey(review: Testimonial): number {
  if (review.submittedAt) {
    const t = new Date(review.submittedAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}

function StarsRow({ rating, size = 14 }: { rating: number; size?: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < filled
              ? "fill-gold-500 text-gold-500"
              : "fill-transparent text-gold-300"
          }
        />
      ))}
    </div>
  );
}

function CustomerPhotosCarousel({ reviews }: { reviews: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const photos = useMemo(
    () =>
      reviews.flatMap((r) =>
        (r.photos ?? []).slice(0, 3).map((src, i) => ({
          src,
          alt: `${r.name} — photo ${i + 1}`,
          key: `${r.id ?? r.name}-${i}`,
        }))
      ),
    [reviews]
  );

  function updateScrollHints() {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollHints();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollHints, { passive: true });
    window.addEventListener("resize", updateScrollHints);
    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      window.removeEventListener("resize", updateScrollHints);
    };
  }, [photos.length]);

  function scroll(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 120, behavior: "smooth" });
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-full min-h-[88px] items-center justify-center rounded-lg border border-dashed border-gold-200 bg-white/60 px-4 text-center text-xs text-forest-950/45">
        Traveler photos appear here when reviews include them.
      </div>
    );
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold-200 bg-white p-1.5 shadow-md hover:bg-gold-50"
          aria-label="Previous customer photos"
        >
          <ChevronLeft size={18} className="text-forest-900" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold-200 bg-white p-1.5 shadow-md hover:bg-gold-50"
          aria-label="Next customer photos"
        >
          <ChevronRight size={18} className="text-forest-900" />
        </button>
      )}
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto scroll-smooth px-8 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p) => (
          <ReviewPhoto
            key={p.key}
            src={p.src}
            alt={p.alt}
            className="h-20 w-20 shrink-0 rounded-md object-cover ring-1 ring-gold-100"
          />
        ))}
      </div>
    </div>
  );
}

function ReviewListItem({ review }: { review: Testimonial }) {
  const verified = review.verified !== false;
  const dateLabel = formatReviewDate(review);

  return (
    <article className="border-b border-gold-100 py-6 last:border-b-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <StarsRow rating={review.rating} />
          <span className="font-semibold text-forest-900">{review.name}</span>
          <span className="text-forest-950/45">·</span>
          <span className="text-forest-950/60">{review.location}</span>
          {verified && (
            <>
              <span className="text-forest-950/45">·</span>
              <span className="text-forest-950/70 underline decoration-forest-950/25 underline-offset-2">
                Verified Traveler
              </span>
            </>
          )}
        </div>
        {dateLabel && (
          <time className="shrink-0 text-sm text-forest-950/50">{dateLabel}</time>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-forest-950/75">{review.quote}</p>
    </article>
  );
}

type Props = {
  reviews: Testimonial[];
};

export default function CustomerReviewsSection({ reviews }: Props) {
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<SortOption>("relevant");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const summary = reviewSummary(reviews);
  const distribution = ratingDistribution(reviews);
  const maxBarCount = Math.max(1, ...distribution.map((d) => d.count));

  const filteredSorted = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    let list = reviews;
    if (q) {
      list = list.filter(
        (r) =>
          r.quote.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }
    const copy = [...list];
    if (sort === "newest") {
      copy.sort((a, b) => reviewSortKey(b) - reviewSortKey(a));
    } else if (sort === "rating") {
      copy.sort((a, b) => b.rating - a.rating || reviewSortKey(b) - reviewSortKey(a));
    }
    return copy;
  }, [reviews, keyword, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [keyword, sort, reviews.length]);

  if (!summary) return null;

  const rounded = Math.round(summary.average * 10) / 10;
  const visible = filteredSorted.slice(0, visibleCount);
  const showingEnd = Math.min(visibleCount, filteredSorted.length);
  const hasMore = visibleCount < filteredSorted.length;

  return (
    <div className="mt-8">
      <div className="grid gap-8 border-b border-gold-200 pb-8 lg:grid-cols-[minmax(140px,180px)_1fr_minmax(220px,320px)] lg:items-start">
        <div>
          <div className="flex items-start gap-3">
            <span className="font-serif text-4xl font-bold leading-none text-forest-900 tabular-nums">
              {rounded.toFixed(1)}
            </span>
            <div className="pt-0.5">
              <StarsRow rating={summary.average} size={16} />
              <p className="mt-1.5 text-sm text-forest-950/60">
                {summary.count} {summary.count === 1 ? "Review" : "Reviews"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {distribution.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="flex w-8 shrink-0 items-center gap-1 text-forest-950/70">
                {stars}
                <Star size={12} className="fill-gold-500 text-gold-500" />
              </span>
              <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gold-100">
                <div
                  className="h-full rounded-full bg-gold-500 transition-[width]"
                  style={{ width: `${(count / maxBarCount) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right tabular-nums text-forest-950/55">
                {count}
              </span>
            </div>
          ))}
        </div>

        <CustomerPhotosCarousel reviews={reviews} />
      </div>

      <div className="flex flex-col gap-4 border-b border-gold-200 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-forest-950/60">
          {filteredSorted.length === 0
            ? "No reviews match your search"
            : `Showing 1–${showingEnd} of ${filteredSorted.length} reviews`}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex overflow-hidden rounded-md border border-gold-200 bg-white">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Filter by keyword"
              className="min-w-0 flex-1 px-3 py-2 text-sm text-forest-900 outline-none placeholder:text-forest-950/40"
              aria-label="Filter reviews by keyword"
            />
            <button
              type="button"
              className="flex items-center justify-center bg-gold-500 px-3 text-white hover:bg-gold-600"
              aria-label="Search reviews"
            >
              <Search size={18} />
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-forest-950/70">
            <span className="shrink-0">Sort By</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-md border border-gold-200 bg-white px-2 py-2 text-sm text-forest-900 outline-none focus:border-gold-400"
            >
              <option value="relevant">Most relevant</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest rating</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        {visible.map((r) => (
          <ReviewListItem key={r.id ?? `${r.name}-${r.quote.slice(0, 24)}`} review={r} />
        ))}
      </div>

      {hasMore && (
        <div className="border-t border-gold-100 pt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest-900 underline decoration-gold-400 underline-offset-4 hover:text-gold-700"
          >
            Show More Reviews
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
