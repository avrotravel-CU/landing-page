/** Build "Town, Country" for review cards (matches curated testimonials). */
export function formatReviewLocation(
  town?: string,
  country?: string,
  location?: string
) {
  const townValue = town?.trim() ?? "";
  const countryValue = country?.trim() ?? "";
  const locationValue = location?.trim() ?? "";

  if (townValue && countryValue) return `${townValue}, ${countryValue}`;
  if (locationValue.includes(",")) return locationValue;
  return townValue || countryValue || locationValue;
}
