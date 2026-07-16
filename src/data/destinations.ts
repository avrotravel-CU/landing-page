import sigiriya from "../assets/destinations/visit_sri_Lanka_Sigiriya.jpg";
import ella from "../assets/destinations/visit_sri_Lanka_Ella.jpg";
import kandy from "../assets/destinations/visit_sri_Lanka_Kandy.jpg";
import galle from "../assets/destinations/visit_sri_Lanka_Galle.jpg";
import yala from "../assets/destinations/visit_sri_Lanka_Yala.jpg";
import mirissa from "../assets/destinations/visit_sri_Lanka_Mirissa.jpg";
import nuwaraEliya from "../assets/destinations/visit_sri_Lanka_Nuwara_Eliya.jpg";
import trincomalee from "../assets/destinations/visit_sri_Lanka_Trincomalee.jpg";
import arugamBay from "../assets/destinations/visit_sri_Lanka_Aruguam_Bay.jpg";
import colombo from "../assets/destinations/visit_sri_Lanka_Colombo.jpg";
import dambulla from "../assets/destinations/visit_sri_Lanka_Dambulla.jpg";
import polonnaruwa from "../assets/destinations/visit_sri_Lanka_Polonnaruwa.jpg";

export type Region =
  | "Cultural Triangle"
  | "Hill Country"
  | "Southern Province"
  | "East Coast"
  | "Western Province"
  | "Central Province";

export interface Destination {
  name: string;
  region: Region;
  description: string;
  image: string;
}

export const regions: Region[] = [
  "Cultural Triangle",
  "Hill Country",
  "Southern Province",
  "East Coast",
  "Western Province",
  "Central Province",
];

export const destinations: Destination[] = [
  {
    name: "Sigiriya",
    region: "Cultural Triangle",
    description:
      "Climb the iconic Lion Rock fortress rising 200m above the jungle, with world-class frescoes and water gardens.",
    image: sigiriya,
  },
  {
    name: "Ella",
    region: "Hill Country",
    description:
      "A misty mountain village with stunning hikes, the Nine Arch Bridge, and sweeping valley views.",
    image: ella,
  },
  {
    name: "Kandy",
    region: "Central Province",
    description:
      "Home of the Sacred Tooth Relic temple and surrounded by lush hills, tea gardens, and rich traditions.",
    image: kandy,
  },
  {
    name: "Galle",
    region: "Southern Province",
    description:
      "A UNESCO listed Dutch colonial fort city with boutique hotels, art galleries, and pristine beaches nearby.",
    image: galle,
  },
  {
    name: "Yala",
    region: "Southern Province",
    description:
      "Sri Lanka's most visited national park, boasting the world's highest density of leopards.",
    image: yala,
  },
  {
    name: "Mirissa",
    region: "Southern Province",
    description:
      "The best spot in Asia to watch blue whales, with a laid back beach vibe and fresh seafood.",
    image: mirissa,
  },
  {
    name: "Nuwara Eliya",
    region: "Hill Country",
    description:
      "Little England in the tropics, rolling tea estates, colonial bungalows, and cool mountain air.",
    image: nuwaraEliya,
  },
  {
    name: "Trincomalee",
    region: "East Coast",
    description:
      "Crystal clear waters, untouched beaches, and the chance to swim with blue whales in season.",
    image: trincomalee,
  },
  {
    name: "Arugam Bay",
    region: "East Coast",
    description:
      "A world class surf point with a bohemian atmosphere and some of Sri Lanka's best sunrises.",
    image: arugamBay,
  },
  {
    name: "Colombo",
    region: "Western Province",
    description:
      "A buzzing cosmopolitan capital with rooftop bars, diverse food scenes, and colonial architecture.",
    image: colombo,
  },
  {
    name: "Dambulla",
    region: "Cultural Triangle",
    description:
      "The famous cave temple complex with over 150 Buddha statues carved into rock.",
    image: dambulla,
  },
  {
    name: "Polonnaruwa",
    region: "Cultural Triangle",
    description:
      "Sri Lanka's medieval capital with well preserved palaces, moonstones, and ancient stupas.",
    image: polonnaruwa,
  },
];
