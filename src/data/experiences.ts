import hikeAdamsPeak from "../assets/experiences/visit_sri_Lanka_Hike_Adams_Peak.jpg";
import paraglideElla from "../assets/experiences/visit_sri_Lanka_Paraglide_Over_Ella.jpg";
import sigiriyaLionRock from "../assets/experiences/visit_sri_Lanka_Sigiriya_Lion_Rock.jpg";
import pinnawalaOrphanage from "../assets/experiences/visit_sri_Lanka_Pinnawala_Elephant_Orphanage.jpg";
import cookingClass from "../assets/experiences/visit_sri_Lanka_Sri_Lankan_Cooking_Class.jpg";
import batikWorkshop from "../assets/experiences/visit_sri_Lanka_Batik_Craft_Workshop.jpg";
import ayurvedaRetreat from "../assets/experiences/visit_sri_Lanka_Ayurveda_Retreat.jpg";
import herbalGarden from "../assets/experiences/visit_sri_Lanka_Herbal_Garden_Walk.jpg";
import streetFoodTour from "../assets/experiences/visit_sri_Lanka_Street_Food_Tour_Colombo.jpg";
import teaFactory from "../assets/experiences/visit_sri_Lanka_Tea_Factory_Visit.jpg";
import elephantSafari from "../assets/experiences/visit_sri_Lanka_Elephant_Safari_Udawalawe.jpg";
import leopardTracking from "../assets/experiences/visit_sri_Lanka_Leopard_Tracking_Yala.jpg";
import snorkelling from "../assets/experiences/visit_sri_Lanka_Snorkelling_Pigeon_Island.jpg";
import whaleWatching from "../assets/experiences/visit_sri_Lanka_Blue_Whale_Watching.jpg";
import surfLessons from "../assets/experiences/visit_sri_Lanka_Surf_Lessons_Aruguam_Bay.jpg";

export const experienceCategories = [
  "Adventure",
  "Culture",
  "Wellness",
  "Food",
  "Wildlife",
  "Water",
] as const;

export type ExperienceCategory = (typeof experienceCategories)[number];

export type Experience = {
  name: string;
  category: ExperienceCategory;
  image: string;
  description: string;
};

export const categoryBadgeStyles: Record<ExperienceCategory, string> = {
  Adventure: "bg-orange-50 text-orange-700",
  Culture: "bg-violet-50 text-violet-700",
  Wellness: "bg-teal-50 text-teal-700",
  Food: "bg-amber-50 text-amber-800",
  Wildlife: "bg-yellow-50 text-yellow-800",
  Water: "bg-sky-100 text-sky-800",
};

export const experiences: Experience[] = [
  {
    name: "Hike Adam's Peak",
    category: "Adventure",
    image: hikeAdamsPeak,
    description:
      "Night climb to the sacred summit for sunrise, a pilgrimage and physical challenge in one.",
  },
  {
    name: "Paraglide Over Ella",
    category: "Adventure",
    image: paraglideElla,
    description:
      "Soar above tea estates and waterfalls with a tandem pilot from Ella Rock launch site.",
  },
  {
    name: "Sigiriya Lion Rock",
    category: "Culture",
    image: sigiriyaLionRock,
    description:
      "Climb the ancient rock fortress and see the world's oldest surviving frescoes.",
  },
  {
    name: "Pinnawala Elephant Orphanage",
    category: "Culture",
    image: pinnawalaOrphanage,
    description:
      "Watch baby elephants bathe in the river and learn about conservation efforts.",
  },
  {
    name: "Sri Lankan Cooking Class",
    category: "Culture",
    image: cookingClass,
    description:
      "Learn to make kottu, dhal curry and hoppers with a local family in their home kitchen.",
  },
  {
    name: "Batik & Craft Workshop",
    category: "Culture",
    image: batikWorkshop,
    description:
      "Create your own traditional batik fabric in a small artisan workshop in Kandy.",
  },
  {
    name: "Ayurveda Retreat",
    category: "Wellness",
    image: ayurvedaRetreat,
    description:
      "Authentic Ayurvedic treatments, oil massages, herbal baths and Panchakarma therapies.",
  },
  {
    name: "Herbal Garden Walk",
    category: "Wellness",
    image: herbalGarden,
    description:
      "Guided walk through a traditional Ayurvedic garden learning plant medicine.",
  },
  {
    name: "Street Food Tour, Colombo",
    category: "Food",
    image: streetFoodTour,
    description:
      "Kottu, hoppers, isso wade and wood apple juice through the lanes of Pettah Market.",
  },
  {
    name: "Tea Factory Visit",
    category: "Food",
    image: teaFactory,
    description:
      "Tour a working tea factory in Nuwara Eliya and taste freshly plucked single-estate teas.",
  },
  {
    name: "Elephant Safari, Udawalawe",
    category: "Wildlife",
    image: elephantSafari,
    description:
      "Watch wild elephants in their natural habitat, herds of 50+ are common.",
  },
  {
    name: "Leopard Tracking, Yala",
    category: "Wildlife",
    image: leopardTracking,
    description:
      "Dawn jeep safari in Yala Block 1, the world's highest density of leopards.",
  },
  {
    name: "Snorkelling, Pigeon Island",
    category: "Water",
    image: snorkelling,
    description:
      "Sri Lanka's only coral sanctuary, home to blacktip reef sharks and sea turtles.",
  },
  {
    name: "Blue Whale Watching",
    category: "Water",
    image: whaleWatching,
    description:
      "Board a small boat off Mirissa for a chance to see the largest animals on earth.",
  },
  {
    name: "Surf Lessons, Arugam Bay",
    category: "Water",
    image: surfLessons,
    description:
      "World-ranked surf point perfect for beginners and advanced surfers alike.",
  },
];
