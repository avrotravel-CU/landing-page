import {
  Sun,
  CalendarDays,
  Coins,
  Languages as LanguagesIcon,
  Clock,
  FileCheck2,
} from "lucide-react";
import bannerBg from "../assets/about-banner-bg.jpg";
import faithBuddhism from "../assets/faith/faith-buddhism.jpg";
import faithHinduism from "../assets/faith/faith-hinduism.jpg";
import faithIslam from "../assets/faith/faith-islam.jpg";
import faithChristianity from "../assets/faith/faith-christianity.jpg";

const QUICK_FACTS = [
  {
    label: "Climate",
    value: "Tropical, warm year round (27-30°C)",
    icon: Sun,
  },
  {
    label: "Best Time to Visit",
    value: "Dec-Mar (South/West) - Jun-Sep (East)",
    icon: CalendarDays,
  },
  {
    label: "Currency",
    value: "Sri Lankan Rupee (LKR)",
    icon: Coins,
  },
  {
    label: "Languages",
    value: "Sinhala, Tamil, English",
    icon: LanguagesIcon,
  },
  {
    label: "Time Zone",
    value: "GMT+5:30 (IST)",
    icon: Clock,
  },
  {
    label: "Visa",
    value: "ETA required, easy online application",
    icon: FileCheck2,
  },
];

const INFO_SECTIONS = [
  {
    title: "A Land Like No Other",
    body: "Sri Lanka, once known as Ceylon, is a teardrop-shaped island off the southern tip of India, packed with more diversity per square kilometre than almost anywhere on earth. In a single day you can stand in an ancient ruined city, climb through a cloud forest, surf a world-class wave, and watch wild elephants cross a riverbank at sunset.",
  },
  {
    title: "History & Culture",
    body: "With over 2,500 years of recorded history, Sri Lanka is home to eight UNESCO World Heritage Sites. The island has been shaped by Sinhalese kingdoms, Portuguese colonists, Dutch traders and British planters, each leaving their mark on the architecture, food, language and customs you'll encounter today.",
  },
  {
    title: "Food & Drink",
    body: "Sri Lankan cuisine is one of the world's great undiscovered food traditions. Rice and curry, hoppers, kottu roti, string hoppers, pol sambol, flavours built on coconut, pandan, goraka and a spice heritage that drew traders across the Indian Ocean for centuries. Don't leave without trying a proper Ceylon high tea.",
  },
  {
    title: "Getting Around",
    body: "The island is compact, most destinations are within a day's drive. The scenic hill-country train network is unmissable. For flexibility and comfort, a private driver-guide is the best way to travel, allowing you to stop at village markets, viewpoints and roadside eateries that no tour bus ever visits.",
  },
];

const FAITHS = [
  { name: "Buddhism", percent: "70%", image: faithBuddhism },
  { name: "Hinduism", percent: "13%", image: faithHinduism },
  { name: "Islam", percent: "10%", image: faithIslam },
  { name: "Christianity", percent: "7%", image: faithChristianity },
];

export default function AboutSriLanka() {
  return (
    <section>
      {/* Banner */}
      <div className="relative overflow-hidden bg-forest-900">
        <img
          src={bannerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-forest-900/40" />

        <div className="relative mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="inline-block rounded-full border border-gold-400/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400">
            The Island
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
            About Sri Lanka
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Eight UNESCO sites, incredible wildlife, ancient temples and
            perfect beaches, all in one small island.
          </p>
          <div className="mt-5 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400/40" />
          </div>
        </div>
      </div>

      {/* Quick facts */}
      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-6 py-10 text-center sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
          {QUICK_FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.label} className="flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-500">
                  <Icon size={20} />
                </span>
                <div className="mt-2.5 text-[13px] font-bold text-forest-900">
                  {fact.label}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-forest-950/55">
                  {fact.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content + Faith & Diversity */}
      <div className="bg-cream-100">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <div className="space-y-10">
            {INFO_SECTIONS.map((info) => (
              <div key={info.title}>
                <h3 className="font-serif text-lg font-bold text-forest-900">
                  {info.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-forest-950/70">
                  {info.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="font-serif text-lg font-bold text-forest-900">
              Faith &amp; Diversity
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {FAITHS.map((faith) => (
                <div
                  key={faith.name}
                  className="relative overflow-hidden rounded-xl shadow-sm"
                >
                  <img
                    src={faith.image}
                    alt={faith.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-center">
                    <div className="text-xs font-bold text-white">
                      {faith.name}
                    </div>
                    <div className="text-[10px] text-gold-100">
                      {faith.percent} of population
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
