import { tourPackages, type TourPackage } from "../data/tourPackages";

export type PlanPrefill = {
  packageName: string;
  adults: string;
  dayCount: number;
  destinations: string[];
  otherDestinations: string;
  activities: string[];
  budget: string;
  dreamTrip: string;
  childFriendly?: "Yes" | "No";
  hotelRating?: string;
  roomTypes?: string[];
};

const DESTINATION_ALIASES: [string, string][] = [
  ["sigiriya", "Sigiriya"],
  ["kandy", "Kandy"],
  ["ella", "Ella"],
  ["galle", "Galle"],
  ["yala", "Yala"],
  ["udawalawe", "Udawalawe"],
  ["mirissa", "Mirissa"],
  ["dambulla", "Dambulla"],
  ["polonnaruwa", "Polonnaruwa"],
  ["arugam bay", "Arugam Bay"],
  ["trincomalee", "Trincomalee"],
  ["bentota", "Bentota"],
  ["anuradhapura", "Anuradhapura"],
  ["nuwara eliya", "Nuwara Eliya"],
  ["adams peak", "Adam's Peak"],
  ["ella rock", "Ella"],
  ["negombo", "Negombo"],
  ["colombo", "Colombo"],
  ["jaffna", "Jaffna"],
  ["horton", "Horton Plains"],
];

const PACKAGE_ACTIVITIES: Record<string, string[]> = {
  "ceylon-classic": [
    "Cultural Heritage Sites",
    "Temple Visits",
    "Scenic Train Journey",
    "Photography Tours",
  ],
  "wildlife-wilderness": [
    "Wildlife Safari",
    "Whale Watching",
    "Photography Tours",
    "Hiking & Trekking",
  ],
  "beach-bliss": [
    "Beach Relaxation",
    "Surfing",
    "Whale Watching",
    "Adventure Sports",
  ],
  "cultural-immersion": [
    "Cultural Heritage Sites",
    "Temple Visits",
    "Local Village Experience",
    "Food Tours",
  ],
  "honeymoon-in-ceylon": [
    "Luxury Experiences",
    "Ayurveda & Wellness",
    "Beach Relaxation",
    "Photography Tours",
  ],
  "family-adventure": [
    "Family Activities",
    "Wildlife Safari",
    "Scenic Train Journey",
    "Food Tours",
  ],
};

function parseDayCount(days: string): number {
  const match = days.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function parseDefaultAdults(group: string): string {
  if (/couple/i.test(group)) return "2";
  if (/famil/i.test(group)) return "2";
  const range = group.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return range[1];
  const single = group.match(/(\d+)/);
  return single ? single[1] : "2";
}

function parseTotalPrice(price: string): number {
  const match = price.match(/([\d,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function budgetOptionForPackage(price: string, dayCount: number): string {
  if (!dayCount) return "";
  const perDay = parseTotalPrice(price) / dayCount;
  if (perDay < 150) return "Under USD 150";
  if (perDay < 300) return "USD 150-300";
  if (perDay < 500) return "USD 300-500";
  if (perDay < 1000) return "USD 500-1,000";
  return "USD 1,000+";
}

function destinationsFromHighlights(highlights: string[]): {
  destinations: string[];
  otherDestinations: string;
} {
  const destinations: string[] = [];
  const unmatched: string[] = [];

  for (const highlight of highlights) {
    const lower = highlight.toLowerCase();
    let matchedDest: string | null = null;

    for (const [key, dest] of DESTINATION_ALIASES) {
      if (lower.includes(key)) {
        matchedDest = dest;
        break;
      }
    }

    if (matchedDest && !destinations.includes(matchedDest)) {
      destinations.push(matchedDest);
    } else if (!matchedDest) {
      unmatched.push(highlight);
    }
  }

  return {
    destinations,
    otherDestinations: unmatched.join(", "),
  };
}

function packageExtras(slug: string): Partial<PlanPrefill> {
  switch (slug) {
    case "honeymoon-in-ceylon":
      return {
        hotelRating: "Luxury Boutique",
        roomTypes: ["Double"],
      };
    case "family-adventure":
      return {
        childFriendly: "Yes",
        roomTypes: ["Family Suite"],
      };
    case "wildlife-wilderness":
      return { hotelRating: "4 Star" };
    case "cultural-immersion":
      return { hotelRating: "4 Star" };
    case "beach-bliss":
      return { hotelRating: "3 Star", roomTypes: ["Double"] };
    default:
      return { hotelRating: "4 Star", roomTypes: ["Double"] };
  }
}

export function getTourPackageBySlug(slug: string): TourPackage | undefined {
  return tourPackages.find((pkg) => pkg.slug === slug);
}

export function getPlanPrefillFromPackage(slug: string): PlanPrefill | null {
  const pkg = getTourPackageBySlug(slug);
  if (!pkg) return null;

  const dayCount = parseDayCount(pkg.days);
  const { destinations, otherDestinations } = destinationsFromHighlights(
    pkg.highlights
  );

  return {
    packageName: pkg.name,
    adults: parseDefaultAdults(pkg.group),
    dayCount,
    destinations,
    otherDestinations,
    activities: PACKAGE_ACTIVITIES[slug] ?? [],
    budget: budgetOptionForPackage(pkg.price, dayCount),
    dreamTrip: `I'm interested in the ${pkg.name} package (${pkg.days}, ${pkg.group}, ${pkg.price}). ${pkg.description}`,
    ...packageExtras(slug),
  };
}
