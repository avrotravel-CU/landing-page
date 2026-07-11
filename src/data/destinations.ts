import sigiriya from "../assets/destinations/sigiriya.jpg";
import ella from "../assets/destinations/ella.jpg";
import kandy from "../assets/destinations/kandy.jpg";
import galle from "../assets/destinations/galle.jpg";
import yala from "../assets/destinations/yala.jpg";
import mirissa from "../assets/destinations/mirissa.jpg";
import nuwaraEliya from "../assets/destinations/nuwara-eliya.jpg";
import trincomalee from "../assets/destinations/trincomalee.jpg";
import arugamBay from "../assets/destinations/arugam-bay.jpg";
import colombo from "../assets/destinations/colombo.jpg";
import dambulla from "../assets/destinations/dambulla.jpg";
import polonnaruwa from "../assets/destinations/polonnaruwa.jpg";

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
