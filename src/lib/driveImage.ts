/** Extract a Google Drive file ID from common URL shapes. */
export function driveFileIdFromUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /[?&]id=([^&]+)/,
    /\/file\/d\/([^/]+)/,
    /\/d\/([^/]+)/,
    /\/uc\?export=view&id=([^&]+)/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

/**
 * URLs that work in <img> on external sites (Vercel). Raw /uc?export=view often breaks.
 */
export function toDisplayableDriveUrl(url: string): string {
  const id = driveFileIdFromUrl(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
}

export function driveUrlFallbackChain(url: string): string[] {
  const id = driveFileIdFromUrl(url);
  if (!id) return [url];
  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `https://lh3.googleusercontent.com/d/${id}=w1600`,
    `https://drive.usercontent.google.com/download?id=${id}&export=view`,
    url,
  ];
}
