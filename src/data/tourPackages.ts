import ceylonClassicImg from "../assets/tour-packages/ceylon_classic.jpg";
import wildlifeImg from "../assets/tour-packages/wildlife.jpg";
import beachBlissImg from "../assets/tour-packages/beach_bliss.jpg";
import culturalImmersionImg from "../assets/tour-packages/cultural_immersion.jpg";
import honeymoonImg from "../assets/tour-packages/honeymoon.jpg";
import familyAdventureImg from "../assets/tour-packages/family_adventure.jpg";

export type TourPackage = {
  name: string;
  badge: string;
  image: string;
  days: string;
  group: string;
  rating: number;
  description: string;
  highlights: string[];
  price: string;
};

export const tourPackages: TourPackage[] = [
  {
    name: "Ceylon Classic",
    badge: "Most Popular",
    image: ceylonClassicImg,
    days: "8 Days",
    group: "2-6 People",
    rating: 4.9,
    description:
      "The essential Sri Lanka experience covering the Cultural Triangle, hill country, and the south coast.",
    highlights: [
      "Sigiriya Rock",
      "Kandy Temple",
      "Ella Nine Arch Bridge",
      "Galle Fort",
    ],
    price: "From USD 850",
  },
  {
    name: "Wildlife & Wilderness",
    badge: "Nature",
    image: wildlifeImg,
    days: "10 Days",
    group: "2-8 People",
    rating: 4.8,
    description:
      "For the nature lover, big cats, elephant herds, blue whales and ancient rainforests.",
    highlights: [
      "Yala Safari",
      "Udawalawe Elephants",
      "Whale Watching Mirissa",
      "Sinharaja Forest",
    ],
    price: "From USD 1,100",
  },
  {
    name: "Beach & Bliss",
    badge: "Relaxation",
    image: beachBlissImg,
    days: "7 Days",
    group: "2-4 People",
    rating: 4.7,
    description:
      "Sun, sea and total relaxation along Sri Lanka's stunning coastline, east and south.",
    highlights: [
      "Mirissa Beach",
      "Arugam Bay Surf",
      "Trincomalee Snorkelling",
      "Bentota Water Sports",
    ],
    price: "From USD 700",
  },
  {
    name: "Cultural Immersion",
    badge: "Deep Dive",
    image: culturalImmersionImg,
    days: "12 Days",
    group: "2-10 People",
    rating: 5,
    description:
      "Go beyond the surface, stay with locals, attend ceremonies, and explore ancient kingdoms.",
    highlights: [
      "Dambulla Cave Temple",
      "Polonnaruwa Ruins",
      "Perahera Festival",
      "Village Homestay",
    ],
    price: "From USD 1,300",
  },
  {
    name: "Honeymoon in Ceylon",
    badge: "Romance",
    image: honeymoonImg,
    days: "10 Days",
    group: "Couples",
    rating: 5,
    description:
      "Intimate, thoughtful and completely private, a love story set against Sri Lanka's most beautiful backdrop.",
    highlights: [
      "Luxury Boutique Hotel",
      "Private Beach Dinner",
      "Couples Ayurveda Spa",
      "Sunrise at Ella Rock",
    ],
    price: "From USD 1,500",
  },
  {
    name: "Family Adventure",
    badge: "Family",
    image: familyAdventureImg,
    days: "9 Days",
    group: "Families",
    rating: 4.8,
    description:
      "Child-friendly adventures, wildlife wonder and cultural discovery, unforgettable for every age.",
    highlights: [
      "Elephant Orphanage",
      "Train Ride to Ella",
      "Turtle Hatchery",
      "Cooking Class",
    ],
    price: "From USD 950",
  },
];
