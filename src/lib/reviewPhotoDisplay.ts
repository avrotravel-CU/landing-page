import { driveFileIdFromUrl } from "./driveImage";

/** Drive file IDs hidden from review carousels and photo lists on /experiences. */
export const BLOCKED_REVIEW_PHOTO_IDS = new Set<string>([
  // Timi — woman in purple top, traditional kitchen (removed from carousel; not in current sheet URLs).
]);

export function filterReviewPhotos(photos: string[] | undefined): string[] {
  if (!photos?.length) return [];
  return photos.filter((url) => {
    const id = driveFileIdFromUrl(url);
    return !id || !BLOCKED_REVIEW_PHOTO_IDS.has(id);
  });
}
