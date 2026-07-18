import { Star } from "lucide-react";
import type { Testimonial } from "../data/testimonials";
import ReviewPhoto from "./ReviewPhoto";

type Props = {
  review: Testimonial;
  layout?: "grid" | "carousel";
};

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TravelerReviewCard({ review, layout = "grid" }: Props) {
  const { name, location, avatar, quote, rating, photos = [], visited } = review;
  const isCarousel = layout === "carousel";
  const visiblePhotos = isCarousel ? photos.slice(0, 1) : photos.slice(0, 5);
  const initials = initialsFor(name);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-gold-100 bg-white shadow-sm ${
        isCarousel ? "min-h-[420px]" : ""
      }`}
    >
      {visiblePhotos.length > 0 && (
        <div
          className={
            isCarousel || visiblePhotos.length === 1
              ? ""
              : visiblePhotos.length === 2
                ? "grid grid-cols-2 gap-0.5"
                : "grid grid-cols-2 gap-0.5 sm:grid-cols-3"
          }
        >
          {visiblePhotos.map((src, i) => (
            <ReviewPhoto
              key={`${name}-photo-${i}`}
              src={src}
              alt={`${name} — photo ${i + 1}`}
              className={
                isCarousel || visiblePhotos.length === 1
                  ? "h-44 w-full object-cover"
                  : "aspect-[4/3] w-full object-cover"
              }
            />
          ))}
        </div>
      )}

      <div className={`flex flex-1 flex-col ${isCarousel ? "p-5" : "p-6"}`}>
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-gold-100"
            />
          ) : (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-forest-900 ring-2 ring-gold-100"
              aria-hidden
            >
              {initials || "?"}
            </div>
          )}
          <div>
            <div className="text-sm font-bold text-forest-900">{name}</div>
            <div className="text-xs text-forest-950/50">{location}</div>
            {visited && (
              <div className="text-[11px] text-forest-950/45">Visited {visited}</div>
            )}
          </div>
        </div>

        <p
          className={`mt-3 flex-1 text-[13px] leading-relaxed text-forest-950/70 ${
            isCarousel ? "line-clamp-5" : ""
          }`}
        >
          &ldquo;{quote}&rdquo;
        </p>

        <div className="mt-3 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
          ))}
        </div>
      </div>
    </article>
  );
}
