import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { Star, Send, Upload, X } from "lucide-react";
import { encodeReviewPhotos } from "../lib/reviewPhotos";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const YEARS = Array.from({ length: 12 }, (_, i) => String(2026 - i));

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const MAX_REVIEW_LENGTH = 500;
const MAX_PHOTOS = 5;

type Props = {
  /** Called after a review is saved so the page can refresh the list. */
  onSubmitted?: () => void;
};

export default function ShareYourStory({ onSubmitted }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const displayRating = hoverRating || rating;

  const canSubmit =
    name.trim() !== "" &&
    country.trim() !== "" &&
    month !== "" &&
    year !== "" &&
    rating > 0 &&
    review.trim() !== "" &&
    !submitting;

  function addPhotos(files: FileList | File[]) {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...incoming].slice(0, MAX_PHOTOS));
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addPhotos(e.dataTransfer.files);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const encodedPhotos = await encodeReviewPhotos(photos);
      const response = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim(),
          month,
          year,
          rating,
          review: review.trim(),
          photos: encodedPhotos,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Could not submit your review");
      }

      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not submit your review"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-14">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-forest-900 sm:text-3xl">
          Share Your Story
        </h2>
        <p className="mt-2 text-sm text-forest-950/60">
          Travelled with Ceylon Unscripted? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
        {submitted ? (
          <div className="rounded-xl bg-gold-50 p-8 text-center">
            <p className="font-serif text-lg font-bold text-forest-900">
              Thank you for sharing your story!
            </p>
            <p className="mt-2 text-sm text-forest-950/65">
              Your review is live on our Experiences page (refresh to see it).
              It also appears in our Google Sheet under the Reviews tab.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                  Your Name <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Thompson"
                  className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                  Country <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Australia"
                  className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                  When did you visit? <span className="text-red-500">*</span>
                </span>
                <select
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-lg border border-forest-900/15 bg-white px-4 py-2.5 text-sm text-forest-950 outline-none transition focus:border-gold-400"
                >
                  <option value="">Select month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:pt-[26px]">
                <select
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-forest-900/15 bg-white px-4 py-2.5 text-sm text-forest-950 outline-none transition focus:border-gold-400"
                >
                  <option value="">Select year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                Your Rating <span className="text-red-500">*</span>
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="rounded p-0.5 transition hover:scale-110"
                      aria-label={`Rate ${value} out of 5`}
                    >
                      <Star
                        size={22}
                        className={
                          value <= displayRating
                            ? "fill-gold-500 text-gold-500"
                            : "text-forest-900/20"
                        }
                      />
                    </button>
                  );
                })}
                {displayRating > 0 && (
                  <span className="ml-2 text-sm text-forest-950/60">
                    {RATING_LABELS[displayRating]}
                  </span>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                Your Review <span className="text-red-500">*</span>
              </span>
              <textarea
                required
                rows={4}
                value={review}
                maxLength={MAX_REVIEW_LENGTH}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
              />
              <p className="mt-1 text-right text-xs text-forest-950/45">
                {review.length} / {MAX_REVIEW_LENGTH}
              </p>
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                Add Photos
              </span>
              <p className="mb-2 text-xs text-forest-950/50">
                Optional — up to {MAX_PHOTOS} photos
              </p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition ${
                  dragOver
                    ? "border-gold-400 bg-gold-50/50"
                    : "border-forest-900/15 bg-cream-50 hover:border-gold-300"
                }`}
              >
                <Upload size={24} className="text-forest-950/35" />
                <p className="mt-2 text-sm font-medium text-forest-950/60">
                  Click or drag to upload
                </p>
                <p className="mt-0.5 text-xs text-forest-950/40">
                  JPG, PNG up to 5 images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="group relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload preview ${i + 1}`}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest-900 text-white shadow-sm transition hover:bg-forest-950"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Your Story"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
