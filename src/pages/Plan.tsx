import { useState, type FormEvent, type ReactNode } from "react";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  Send,
} from "lucide-react";
import planCollage from "../assets/plan-collage.jpg";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "India",
  "Singapore",
  "United Arab Emirates",
  "Japan",
  "China",
  "New Zealand",
  "South Africa",
  "Other",
];

const DAYS_OPTIONS = [
  "1-3 Days",
  "4-6 Days",
  "7-9 Days",
  "10-14 Days",
  "15-21 Days",
  "22+ Days",
];

const ADULTS_OPTIONS = ["1", "2", "3", "4", "5", "6+"];

const DESTINATIONS = [
  "Colombo",
  "Custom Destinations",
  "Bentota",
  "Trincomalee",
  "Arugam Bay",
  "Jaffna",
  "Anuradhapura",
  "Polonnaruwa",
  "Horton Plains",
  "Adam's Peak",
  "Galle",
  "Negombo",
  "Kandy",
  "Sigiriya",
  "Dambulla",
  "Nuwara Eliya",
  "Ella",
  "Yala",
  "Udawalawe",
  "Mirissa",
];

const HOTEL_RATINGS = [
  "Budget",
  "3 Star",
  "4 Star",
  "5 Star",
  "Luxury Boutique",
  "Mixed Options",
];

const ROOM_TYPES = [
  { label: "Single", emoji: "🛏️" },
  { label: "Double", emoji: "🛏️" },
  { label: "Twin", emoji: "🛏️" },
  { label: "Family Suite", emoji: "🛋️" },
  { label: "Villa", emoji: "🏡" },
];

const ACTIVITIES = [
  { label: "Wildlife Safari", emoji: "🦁" },
  { label: "Volunteer Experiences", emoji: "🦋" },
  { label: "Photography Tours", emoji: "📷" },
  { label: "Beach Relaxation", emoji: "🏖️" },
  { label: "Surfing", emoji: "🏄" },
  { label: "Hiking & Trekking", emoji: "🥾" },
  { label: "Scenic Train Journey", emoji: "🚂" },
  { label: "Tea Plantation Visits", emoji: "🍵" },
  { label: "Cultural Heritage Sites", emoji: "🏛️" },
  { label: "Temple Visits", emoji: "🛕" },
  { label: "Ayurveda & Wellness", emoji: "🧘" },
  { label: "Whale Watching", emoji: "🐋" },
  { label: "Custom Activities", emoji: "✏️" },
  { label: "Adventure Sports", emoji: "🪂" },
  { label: "Local Village Experience", emoji: "🏘️" },
  { label: "Food Tours", emoji: "🍜" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Nightlife", emoji: "🌙" },
  { label: "Family Activities", emoji: "🖼️" },
  { label: "Luxury Experiences", emoji: "💎" },
];

const LANGUAGES = [
  "English",
  "Sinhala",
  "Tamil",
  "German",
  "French",
  "Spanish",
  "Chinese (Mandarin)",
  "Japanese",
  "Russian",
  "Other",
];

const DRIVER_AGES = ["No Preference", "20s", "30s", "40s", "50+"];

const FOOD_PREFS = [
  { label: "Everything", emoji: "🍽️" },
  { label: "Vegan", emoji: "🌱" },
  { label: "Gluten-Free", emoji: "🌾" },
  { label: "No Beef", emoji: "🚫🐄" },
  { label: "Kosher", emoji: "✡️" },
  { label: "Vegetarian", emoji: "🥗" },
  { label: "Pescatarian", emoji: "🐟" },
  { label: "No Pork", emoji: "🚫🐷" },
  { label: "Halal", emoji: "☪️" },
];

const SPICE_LEVELS = [
  { label: "Mild", emoji: "😊" },
  { label: "Medium", emoji: "😄" },
  { label: "Hot", emoji: "😰" },
  { label: "Extra Hot", emoji: "🔥" },
  { label: "No Spice", emoji: "❄️" },
];

const CULTURAL_PREFS = [
  { label: "Religious requirements", emoji: "ℹ️" },
  { label: "Cultural considerations", emoji: "🌍" },
  { label: "Dress code preferences", emoji: "👗" },
  { label: "Privacy requirements", emoji: "🔒" },
  { label: "Accessibility needs", emoji: "♿" },
  { label: "Special requests", emoji: "⭐" },
];

const BUDGET_OPTIONS = [
  { title: "Under USD 150", subtitle: "Budget Traveller" },
  { title: "USD 150-300", subtitle: "Economy" },
  { title: "USD 300-500", subtitle: "Comfort" },
  { title: "USD 500-1,000", subtitle: "Luxury" },
  { title: "USD 1,000+", subtitle: "Ultra Luxury" },
];

const NEXT_STEPS = [
  {
    title: "We receive your request",
    text: "Our travel experts review your requirements",
  },
  {
    title: "We create a custom itinerary",
    text: "Tailored just for you within 24 hours",
  },
  {
    title: "We send you a proposal",
    text: "Review and make changes if needed",
  },
  {
    title: "You confirm & we organize",
    text: "Sit back and get ready for your adventure!",
  },
];

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function SectionCard({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-gold-100 pb-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-white">
          {num}
        </span>
        <h2 className="font-serif text-lg font-bold text-forest-900">
          {title}
        </h2>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-semibold text-forest-900">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
  );
}

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
    />
  );
}

function DateInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder="dd/mm/yyyy"
        className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 pr-10 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
      />
      <Calendar
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-950/35"
      />
    </div>
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: string[];
    placeholder: string;
  }
) {
  const { options, placeholder, ...rest } = props;
  return (
    <select
      {...rest}
      className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 outline-none transition focus:border-gold-400"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Radio({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-forest-950/75">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-forest-900/30 text-gold-500 focus:ring-gold-400"
      />
      {label}
    </label>
  );
}

function CheckboxItem({
  item,
  selected,
  onToggle,
}: {
  item: { label: string; emoji: string };
  selected: string[];
  onToggle: (label: string) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-forest-950/80">
      <input
        type="checkbox"
        checked={selected.includes(item.label)}
        onChange={() => onToggle(item.label)}
        className="h-4 w-4 shrink-0 rounded border-forest-900/30 text-gold-500 focus:ring-gold-400"
      />
      <span>{item.emoji}</span>
      {item.label}
    </label>
  );
}

function CheckboxGrid({
  items,
  selected,
  onToggle,
  columns = 2,
}: {
  items: { label: string; emoji: string }[];
  selected: string[];
  onToggle: (label: string) => void;
  columns?: number;
}) {
  if (columns === 1) {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <CheckboxItem
            key={item.label}
            item={item}
            selected={selected}
            onToggle={onToggle}
          />
        ))}
      </div>
    );
  }

  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      <div className="space-y-3">
        {left.map((item) => (
          <CheckboxItem
            key={item.label}
            item={item}
            selected={selected}
            onToggle={onToggle}
          />
        ))}
      </div>
      <div className="mt-3 space-y-3 sm:mt-0">
        {right.map((item) => (
          <CheckboxItem
            key={item.label}
            item={item}
            selected={selected}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? "rounded-full border-2 border-gold-500 bg-gold-50 px-4 py-2 text-sm font-semibold text-forest-900"
          : "rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-semibold text-forest-950/70 transition hover:border-gold-300"
      }
    >
      {children}
    </button>
  );
}

export default function Plan() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [contactMethod, setContactMethod] = useState<"Email" | "WhatsApp">(
    "Email"
  );

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [days, setDays] = useState("");
  const [adults, setAdults] = useState("");
  const [infants, setInfants] = useState(0);
  const [children, setChildren] = useState(0);
  const [teens, setTeens] = useState(0);
  const [pets, setPets] = useState<"No" | "Yes">("No");

  const [destinations, setDestinations] = useState<string[]>([]);
  const [otherDestinations, setOtherDestinations] = useState("");

  const [hotelRating, setHotelRating] = useState("");
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  const [activities, setActivities] = useState<string[]>([]);
  const [otherActivities, setOtherActivities] = useState("");

  const [language, setLanguage] = useState("");
  const [driverGender, setDriverGender] = useState<
    "No Preference" | "Male" | "Female"
  >("No Preference");
  const [driverAge, setDriverAge] = useState("");
  const [lgbtqFriendly, setLgbtqFriendly] = useState<
    "Yes" | "No" | "No Preference"
  >("No Preference");
  const [childFriendly, setChildFriendly] = useState<"Yes" | "No">("No");

  const [foodPrefs, setFoodPrefs] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState("");
  const [allergies, setAllergies] = useState("");

  const [culturalPrefs, setCulturalPrefs] = useState<string[]>([]);
  const [culturalDetails, setCulturalDetails] = useState("");

  const [budget, setBudget] = useState("");
  const [dreamTrip, setDreamTrip] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = Boolean(
    firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      country &&
      arrival &&
      departure &&
      days &&
      adults &&
      agreed
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (canSubmit) setSubmitted(true);
  }

  return (
    <main className="bg-cream-100">
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            <MapPin size={13} /> Sri Lanka
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Sri Lanka Tour Request Form
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Tell us about your dream trip to Sri Lanka and we'll create the
            perfect itinerary for you!
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-gold-400" /> 100%
              Customised Tours
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-gold-400" /> Local
              Expert
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-gold-400" /> Safer
              Payment Options
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
          {submitted ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-gold-100 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-bold text-forest-900">
                Request Submitted!
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-forest-950/60">
                Thank you, {firstName || "traveler"}. Our travel experts will
                review your requirements and send you a custom itinerary
                within 24 hours.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gold-50 px-4 py-3 text-xs text-forest-950/60">
                <Mail size={14} className="text-gold-500" />
                Questions in the meantime? Email{" "}
                <a
                  href="mailto:hello@ceylonunscripted.com"
                  className="font-semibold text-gold-600"
                >
                  hello@ceylonunscripted.com
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                <div className="space-y-6">
                  <SectionCard num={1} title="Contact Information">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <Label required>First Name</Label>
                        <TextInput
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <Label required>Last Name</Label>
                        <TextInput
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <Label required>Email Address</Label>
                      <TextInput
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <Label>Phone / WhatsApp</Label>
                      <TextInput
                        placeholder="+1 234 567 8900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <Label required>Country of Residence</Label>
                      <Select
                        options={COUNTRIES}
                        placeholder="Select..."
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </label>
                    <div>
                      <Label>Preferred Contact Method</Label>
                      <div className="flex gap-5">
                        <Radio
                          label="Email"
                          name="contactMethod"
                          checked={contactMethod === "Email"}
                          onChange={() => setContactMethod("Email")}
                        />
                        <Radio
                          label="WhatsApp"
                          name="contactMethod"
                          checked={contactMethod === "WhatsApp"}
                          onChange={() => setContactMethod("WhatsApp")}
                        />
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard num={2} title="Trip Details">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <Label required>Planned Arrival Date</Label>
                        <DateInput
                          value={arrival}
                          onChange={(e) => setArrival(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <Label required>Planned Departure Date</Label>
                        <DateInput
                          value={departure}
                          onChange={(e) => setDeparture(e.target.value)}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <Label required>Number of Days in Sri Lanka</Label>
                      <Select
                        options={DAYS_OPTIONS}
                        placeholder="Select..."
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <Label required>Number of Adults</Label>
                        <Select
                          options={ADULTS_OPTIONS}
                          placeholder="Select"
                          value={adults}
                          onChange={(e) => setAdults(e.target.value)}
                        />
                      </label>
                      <div>
                        <Label>Number of Children</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <label className="block">
                            <span className="mb-1 block text-xs text-forest-950/55">
                              Infant (0-2)
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={infants}
                              onChange={(e) =>
                                setInfants(Number(e.target.value))
                              }
                              className="w-full rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none focus:border-gold-400"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs text-forest-950/55">
                              Child (3-12)
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={children}
                              onChange={(e) =>
                                setChildren(Number(e.target.value))
                              }
                              className="w-full rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none focus:border-gold-400"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs text-forest-950/55">
                              Teen (13-17)
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={teens}
                              onChange={(e) =>
                                setTeens(Number(e.target.value))
                              }
                              className="w-full rounded-lg border border-forest-900/15 px-3 py-2 text-sm text-forest-950 outline-none focus:border-gold-400"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Will you be travelling with pets?</Label>
                      <div className="flex gap-5">
                        <Radio
                          label="No"
                          name="pets"
                          checked={pets === "No"}
                          onChange={() => setPets("No")}
                        />
                        <Radio
                          label="Yes (Please specify)"
                          name="pets"
                          checked={pets === "Yes"}
                          onChange={() => setPets("Yes")}
                        />
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard num={3} title="Destinations You Would Like to Visit">
                    <p className="text-sm text-forest-950/55">
                      Select all that apply
                    </p>
                    <div className="grid grid-cols-2 gap-x-6">
                      {[
                        DESTINATIONS.slice(
                          0,
                          Math.ceil(DESTINATIONS.length / 2)
                        ),
                        DESTINATIONS.slice(
                          Math.ceil(DESTINATIONS.length / 2)
                        ),
                      ].map((col, i) => (
                        <div key={i} className="space-y-2.5">
                          {col.map((d) => (
                            <label
                              key={d}
                              className="flex items-center gap-2.5 text-sm text-forest-950/80"
                            >
                              <input
                                type="checkbox"
                                checked={destinations.includes(d)}
                                onChange={() =>
                                  setDestinations((prev) =>
                                    toggleValue(prev, d)
                                  )
                                }
                                className="h-4 w-4 shrink-0 rounded border-forest-900/30 text-gold-500 focus:ring-gold-400"
                              />
                              {d}
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                    <TextInput
                      placeholder="Other destinations (please specify)"
                      value={otherDestinations}
                      onChange={(e) => setOtherDestinations(e.target.value)}
                    />
                  </SectionCard>

                  <SectionCard num={4} title="Accommodation Preferences">
                    <div>
                      <Label>Preferred Hotel Rating</Label>
                      <div className="flex flex-wrap gap-3">
                        {HOTEL_RATINGS.map((r) => (
                          <Pill
                            key={r}
                            selected={hotelRating === r}
                            onClick={() => setHotelRating(r)}
                          >
                            {r}
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Preferred Room Type</Label>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {ROOM_TYPES.map((r) => (
                          <button
                            key={r.label}
                            type="button"
                            onClick={() =>
                              setRoomTypes((prev) =>
                                toggleValue(prev, r.label)
                              )
                            }
                            className={
                              roomTypes.includes(r.label)
                                ? "flex flex-col items-center gap-1.5 rounded-lg border-2 border-gold-500 bg-gold-50 px-2 py-3 text-xs font-medium text-forest-900"
                                : "flex flex-col items-center gap-1.5 rounded-lg border border-forest-900/15 px-2 py-3 text-xs font-medium text-forest-950/70 transition hover:border-gold-300"
                            }
                          >
                            <span className="text-xl">{r.emoji}</span>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard num={5} title="Activities of Interest">
                    <p className="text-sm text-forest-950/55">
                      Select all that apply
                    </p>
                    <CheckboxGrid
                      items={ACTIVITIES}
                      selected={activities}
                      onToggle={(label) =>
                        setActivities((prev) => toggleValue(prev, label))
                      }
                    />
                    <TextInput
                      placeholder="Other activities (please specify)"
                      value={otherActivities}
                      onChange={(e) => setOtherActivities(e.target.value)}
                    />
                  </SectionCard>
                </div>

                <div className="space-y-6">
                  <SectionCard num={6} title="Driver & Guide Preferences">
                    <label className="block">
                      <Label>Preferred Language</Label>
                      <Select
                        options={LANGUAGES}
                        placeholder="Select language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </label>
                    <div>
                      <Label>Driver Gender Preference</Label>
                      <div className="flex flex-wrap gap-5">
                        {(["No Preference", "Male", "Female"] as const).map(
                          (opt) => (
                            <Radio
                              key={opt}
                              label={opt}
                              name="driverGender"
                              checked={driverGender === opt}
                              onChange={() => setDriverGender(opt)}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <label className="block">
                      <Label>Preferred Driver Age</Label>
                      <Select
                        options={DRIVER_AGES}
                        placeholder="No Preference"
                        value={driverAge}
                        onChange={(e) => setDriverAge(e.target.value)}
                      />
                    </label>
                    <div>
                      <Label>LGBTQ Friendly Driver Required?</Label>
                      <div className="flex flex-wrap gap-5">
                        {(["Yes", "No", "No Preference"] as const).map(
                          (opt) => (
                            <Radio
                              key={opt}
                              label={opt}
                              name="lgbtq"
                              checked={lgbtqFriendly === opt}
                              onChange={() => setLgbtqFriendly(opt)}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Need Child Friendly Driver?</Label>
                      <div className="flex gap-5">
                        {(["Yes", "No"] as const).map((opt) => (
                          <Radio
                            key={opt}
                            label={opt}
                            name="childFriendlyDriver"
                            checked={childFriendly === opt}
                            onChange={() => setChildFriendly(opt)}
                          />
                        ))}
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard num={7} title="Food & Dietary Preferences">
                    <CheckboxGrid
                      items={FOOD_PREFS}
                      selected={foodPrefs}
                      onToggle={(label) =>
                        setFoodPrefs((prev) => toggleValue(prev, label))
                      }
                    />
                    <div>
                      <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-forest-900">
                        🌶️ Spice Level
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {SPICE_LEVELS.map((s) => (
                          <Pill
                            key={s.label}
                            selected={spiceLevel === s.label}
                            onClick={() => setSpiceLevel(s.label)}
                          >
                            {s.emoji} {s.label}
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <label className="block">
                      <Label>Allergy & Medical Concerns</Label>
                      <textarea
                        rows={2}
                        placeholder="List any food allergies or medical concerns..."
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                      />
                    </label>
                  </SectionCard>

                  <SectionCard num={8} title="Cultural & Religious Preferences">
                    <p className="text-sm text-forest-950/55">
                      Please let us know if you have any:
                    </p>
                    <CheckboxGrid
                      items={CULTURAL_PREFS}
                      selected={culturalPrefs}
                      onToggle={(label) =>
                        setCulturalPrefs((prev) => toggleValue(prev, label))
                      }
                      columns={1}
                    />
                    <textarea
                      rows={2}
                      placeholder="Please provide more details..."
                      value={culturalDetails}
                      onChange={(e) => setCulturalDetails(e.target.value)}
                      className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                    />
                  </SectionCard>

                  <SectionCard num={9} title="Budget">
                    <p className="text-sm text-forest-950/55">
                      Per Person, Per Day (excluding flights)
                    </p>
                    <div className="space-y-3">
                      {BUDGET_OPTIONS.map((b) => (
                        <button
                          key={b.title}
                          type="button"
                          onClick={() => setBudget(b.title)}
                          className={
                            budget === b.title
                              ? "block w-full rounded-lg border-2 border-gold-500 bg-gold-50 px-4 py-3 text-left"
                              : "block w-full rounded-lg border border-forest-900/15 px-4 py-3 text-left transition hover:border-gold-300"
                          }
                        >
                          <span className="block text-sm font-bold text-forest-900">
                            {b.title}
                          </span>
                          <span className="block text-sm text-forest-950/55">
                            {b.subtitle}
                          </span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                  <SectionCard num={10} title="Tell Us About Your Dream Trip">
                    <label className="block">
                      <Label>
                        What are your main expectations from this trip to Sri
                        Lanka?
                      </Label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your dream experience, what you hope to see, feel, and discover in Sri Lanka..."
                        value={dreamTrip}
                        onChange={(e) => setDreamTrip(e.target.value)}
                        className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                      />
                    </label>

                    <label className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-900/30 text-gold-500 focus:ring-gold-400"
                      />
                      <span className="text-sm text-forest-950/70">
                        I agree to the{" "}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="font-medium text-gold-600 hover:underline"
                        >
                          Terms &amp; Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="font-medium text-gold-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                        . I consent to being contacted about my trip request.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Send size={16} />
                      Submit My Request
                    </button>
                  </SectionCard>
                </div>

                <div className="rounded-2xl border border-gold-100 bg-peach-100 p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-forest-900">
                    What Happens Next?
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {NEXT_STEPS.map((s, i) => (
                      <li key={s.title} className="relative flex gap-3">
                        {i < NEXT_STEPS.length - 1 && (
                          <span className="absolute left-3.5 top-7 h-full w-px bg-gold-500/40" />
                        )}
                        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-forest-900">
                            {s.title}
                          </p>
                          <p className="text-[13px] text-forest-950/60">
                            {s.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <img
                    src={planCollage}
                    alt="Ceylon Unscripted — Real Places. Real People. Real Stories."
                    className="mt-5 aspect-square w-full rounded-xl object-cover shadow-sm"
                  />

                  <div className="mt-5 space-y-2.5 text-sm text-forest-950/70">
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-gold-500" />
                      +94 11 234 5678
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-gold-500" />
                      hello@ceylonunscripted.com
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold-500" />
                      Colombo 03, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
