/**
 * Traveler reviews on /experiences (“Hear From Our Travelers”).
 *
 * To add a review with pictures:
 * 1. Add JPG/PNG files under src/assets/testimonials/reviews/
 * 2. import them below and append a new object to testimonials[]
 * 3. photos[] — trip photos (shown on the card). avatar — small profile image.
 */

import avatarJames from "../assets/testimonials/avatar_james.jpg";
import avatarMariaCarlos from "../assets/testimonials/avatar_maria_carlos.jpg";
import avatarPatel from "../assets/testimonials/avatar_patel.jpg";

import sarahCooking1 from "../assets/testimonials/reviews/sarah_cooking_1.jpg";
import sarahCooking2 from "../assets/testimonials/reviews/sarah_cooking_2.jpg";
import jamesElephants1 from "../assets/testimonials/reviews/james_elephants_1.jpg";
import jamesElephants2 from "../assets/testimonials/reviews/james_elephants_2.jpg";
import mariaAdamsPeak1 from "../assets/testimonials/reviews/maria_adams_peak_1.png";
import mariaAdamsPeak2 from "../assets/testimonials/reviews/maria_adams_peak_2.png";
import patelAyurveda1 from "../assets/testimonials/reviews/patel_ayurveda_1.jpg";
import patelAyurveda2 from "../assets/testimonials/reviews/patel_ayurveda_2.jpg";

export type Testimonial = {
  name: string;
  location: string;
  avatar?: string;
  quote: string;
  rating: number;
  photos?: string[];
  visited?: string;
  id?: string;
  submittedAt?: string;
  verified?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Thompson",
    location: "Melbourne, Australia",
    visited: "November 2025",
    photos: [sarahCooking1, sarahCooking2],
    quote:
      "The cooking class in a local home was absolutely unforgettable. Learning to make hoppers from scratch while hearing stories about family recipes passed down generations, that's the real Ceylon. Our host treated us like family, not tourists.",
    rating: 5,
    verified: true,
  },
  {
    name: "James Mitchell",
    location: "London, UK",
    visited: "August 2025",
    avatar: avatarJames,
    photos: [jamesElephants1, jamesElephants2],
    quote:
      "Watching a herd of 60+ elephants at Udawalawe was surreal. No fences, no enclosures, just wild elephants living freely. Our guide knew every waterhole and we saw mothers with calves, bulls sparring, it was nature at its finest.",
    rating: 5,
    verified: true,
  },
  {
    name: "Maria & Carlos Rodriguez",
    location: "Barcelona, Spain",
    visited: "January 2026",
    avatar: avatarMariaCarlos,
    photos: [mariaAdamsPeak1, mariaAdamsPeak2],
    quote:
      "We climbed Adam's Peak at 2am under a sky full of stars. Reaching the summit at sunrise with thousands of pilgrims from all faiths was deeply moving. It wasn't just a hike, it was a spiritual journey we'll never forget.",
    rating: 5,
    verified: true,
  },
  {
    name: "The Patel Family",
    location: "Toronto, Canada",
    visited: "June 2025",
    avatar: avatarPatel,
    photos: [patelAyurveda1, patelAyurveda2],
    quote:
      "The Ayurveda retreat was exactly what we needed after months of stress. Authentic treatments using traditional methods, herbal oils prepared fresh daily, and therapists who truly understood healing. We left feeling renewed, body and soul.",
    rating: 5,
    verified: true,
  },
];
