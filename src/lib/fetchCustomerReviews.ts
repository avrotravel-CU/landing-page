import { formatReviewLocation } from "./reviewLocation";
import { filterReviewPhotos } from "./reviewPhotoDisplay";
import type { CustomerReview } from "../types/review";
import type { Testimonial } from "../data/testimonials";

export type ReviewsApiResponse = {
  reviews?: CustomerReview[];
  error?: string;
};

function mapCustomerReview(review: CustomerReview): Testimonial | null {
  try {
    const quote = String(review.quote ?? "").trim();
    const name = String(review.name ?? "").trim();
    if (!name || !quote) return null;

    const rating = Number(review.rating);
    return {
      id: review.id,
      name,
      location: formatReviewLocation(review.town, review.country, review.location),
      visited: String(review.visited ?? "").trim(),
      quote,
      rating: Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating : 5,
      photos: filterReviewPhotos(review.photos),
      submittedAt: review.submittedAt,
      verified: true,
    };
  } catch (err) {
    console.error("Skipping invalid customer review:", review.id, err);
    return null;
  }
}

export async function fetchCustomerReviews(): Promise<{
  reviews: Testimonial[];
  error?: string;
}> {
  const res = await fetch("/api/reviews", {
    headers: { Accept: "application/json" },
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const snippet = (await res.text()).slice(0, 120);
    throw new Error(
      `Reviews API returned ${res.status} (${contentType || "no content-type"}): ${snippet}`
    );
  }

  const data = (await res.json()) as ReviewsApiResponse;
  if (!res.ok) {
    throw new Error(data.error ?? `Reviews API failed (${res.status})`);
  }

  if (data.error) {
    console.warn("Reviews API warning:", data.error);
  }

  const reviews = Array.isArray(data.reviews)
    ? data.reviews
        .map(mapCustomerReview)
        .filter((review): review is Testimonial => review !== null)
    : [];

  return { reviews, error: data.error };
}
