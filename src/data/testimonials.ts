import avatarSarah from "../assets/testimonials/avatar_sarah.jpg";
import avatarJames from "../assets/testimonials/avatar_james.jpg";
import avatarMariaCarlos from "../assets/testimonials/avatar_maria_carlos.jpg";
import avatarPatel from "../assets/testimonials/avatar_patel.jpg";

export type Testimonial = {
  name: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Thompson",
    location: "Melbourne, Australia",
    avatar: avatarSarah,
    quote:
      "The cooking class in a local home was absolutely unforgettable. Learning to make hoppers from scratch while hearing stories about family recipes passed down generations, that's the real Ceylon. Our host treated us like family, not tourists.",
    rating: 5,
  },
  {
    name: "James Mitchell",
    location: "London, UK",
    avatar: avatarJames,
    quote:
      "Watching a herd of 60+ elephants at Udawalawe was surreal. No fences, no enclosures, just wild elephants living freely. Our guide knew every waterhole and we saw mothers with calves, bulls sparring, it was nature at its finest.",
    rating: 5,
  },
  {
    name: "Maria & Carlos Rodriguez",
    location: "Barcelona, Spain",
    avatar: avatarMariaCarlos,
    quote:
      "We climbed Adam's Peak at 2am under a sky full of stars. Reaching the summit at sunrise with thousands of pilgrims from all faiths was deeply moving. It wasn't just a hike, it was a spiritual journey we'll never forget.",
    rating: 5,
  },
  {
    name: "The Patel Family",
    location: "Toronto, Canada",
    avatar: avatarPatel,
    quote:
      "The Ayurveda retreat was exactly what we needed after months of stress. Authentic treatments using traditional methods, herbal oils prepared fresh daily, and therapists who truly understood healing. We left feeling renewed, body and soul.",
    rating: 5,
  },
];
