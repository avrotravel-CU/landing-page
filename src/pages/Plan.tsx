import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  Send,
} from "lucide-react";
import planCollage from "../assets/plan-collage.jpg";
import { COUNTRIES } from "../data/countries";
import { getPlanPrefillFromPackage } from "../lib/tourPackagePrefill";

function parseDateOnly(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function earliestArrivalDate(from = new Date()): string {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  date.setDate(date.getDate() + 7);
  return formatDateInput(date);
}

function formatDisplayDate(value: string): string {
  const date = parseDateOnly(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calculateTripDays(arrival: string, departure: string): number {
  const start = parseDateOnly(arrival);
  const end = parseDateOnly(departure);
  if (!start || !end) return 0;
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

function addDaysToDateString(value: string, daysToAdd: number): string {
  const date = parseDateOnly(value);
  if (!date) return "";
  date.setDate(date.getDate() + daysToAdd);
  return formatDateInput(date);
}

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
  "1 Star",
  "2 Star",
  "3 Star",
  "4 Star",
  "5 Star",
  "Luxury Boutique",
];

const ROOM_TYPES = [
  { label: "Single", emoji: "🛏️" },
  { label: "Double", emoji: "🛏️" },
  { label: "Twin", emoji: "🛏️" },
  { label: "Family Suite", emoji: "🛋️" },
  { label: "Villa", emoji: "🏡" },
];

const MEAL_PLANS = [
  { title: "Bed & Breakfast (B/B)", subtitle: "Breakfast and bed included" },
  { title: "Half Board", subtitle: "Breakfast and dinner included" },
  { title: "Full Board", subtitle: "All meals included" },
  { title: "Bed Only", subtitle: "Room only — no meals needed" },
  { title: "Mixed Options", subtitle: "Different requirements by stay" },
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

function DateInput({
  onChange,
  value,
  placeholder = "YYYY-MM-DD",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    if ("showPicker" in el) {
      try {
        (el as HTMLInputElement & { showPicker: () => void }).showPicker();
      } catch {
        // Some browsers throw if not called from a direct user gesture.
      }
    }
  }

  function closePicker(el: HTMLInputElement) {
    el.blur();
  }

  function closeIfComplete(el: HTMLInputElement) {
    if (!el.value || !el.validity.valid) return;
    closePicker(el);
    queueMicrotask(() => closePicker(el));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(e);
    closeIfComplete(e.currentTarget);
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    closeIfComplete(e.currentTarget);
  }

  return (
    <div className="relative">
      <input
        {...props}
        ref={inputRef}
        type="date"
        value={value ?? ""}
        required
        autoComplete="off"
        data-placeholder={placeholder}
        onInput={handleInput}
        onChange={handleChange}
        className={`date-input w-full rounded-lg border border-forest-900/15 px-4 py-2.5 pr-10 text-sm text-forest-950 outline-none transition [color-scheme:light] focus:border-gold-400 ${
          value ? "" : "text-forest-950/35"
        }`}
      />
      <button
        type="button"
        onClick={openPicker}
        tabIndex={-1}
        aria-label="Open calendar"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-950/35 transition hover:text-gold-500"
      >
        <Calendar size={16} />
      </button>
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
  const [searchParams] = useSearchParams();
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
  const [adults, setAdults] = useState("");
  const [infants, setInfants] = useState(0);
  const [children, setChildren] = useState(0);
  const [teens, setTeens] = useState(0);
  const [pets, setPets] = useState<"No" | "Yes">("No");
  const [petDetails, setPetDetails] = useState("");

  const [destinations, setDestinations] = useState<string[]>([]);
  const [otherDestinations, setOtherDestinations] = useState("");

  const [hotelRating, setHotelRating] = useState("");
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = useState("");
  const [mixedMealDetails, setMixedMealDetails] = useState("");

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const [packageDayCount, setPackageDayCount] = useState<number | null>(null);

  const minArrivalDate = useMemo(() => earliestArrivalDate(), []);

  const minDepartureDate = useMemo(() => {
    if (arrival && arrival >= minArrivalDate) return arrival;
    return minArrivalDate;
  }, [arrival, minArrivalDate]);

  const tripDayCount = useMemo(() => {
    if (!arrival || !departure) return null;
    return calculateTripDays(arrival, departure);
  }, [arrival, departure]);

  const tripDays =
    tripDayCount !== null && tripDayCount > 0 ? String(tripDayCount) : "";

  const missingRequired = (() => {
    const missing: string[] = [];
    if (!firstName.trim()) missing.push("First name");
    if (!lastName.trim()) missing.push("Last name");
    if (!email.trim()) missing.push("Email address");
    if (!country) missing.push("Country of residence");
    if (!arrival) missing.push("Planned arrival date");
    if (!departure) missing.push("Planned departure date");
    if (tripDayCount === null || tripDayCount <= 0) {
      missing.push("Number of days");
    }
    if (!adults) missing.push("Number of adults");
    if (!agreed) missing.push("Terms & Privacy agreement");
    return missing;
  })();

  const canSubmit = missingRequired.length === 0;

  useEffect(() => {
    const slug = searchParams.get("package");
    if (!slug) return;

    const prefill = getPlanPrefillFromPackage(slug);
    if (!prefill) return;

    setSelectedPackageName(prefill.packageName);
    setPackageDayCount(prefill.dayCount);
    setAdults(prefill.adults);
    setDestinations(prefill.destinations);
    setOtherDestinations(prefill.otherDestinations);
    setActivities(prefill.activities);
    setBudget(prefill.budget);
    setDreamTrip(prefill.dreamTrip);
    if (prefill.childFriendly) setChildFriendly(prefill.childFriendly);
    if (prefill.hotelRating) setHotelRating(prefill.hotelRating);
    if (prefill.roomTypes?.length) setRoomTypes(prefill.roomTypes);
  }, [searchParams]);

  useEffect(() => {
    if (arrival && arrival < minArrivalDate) setArrival("");
  }, [arrival, minArrivalDate]);

  useEffect(() => {
    if (departure && departure < minDepartureDate) setDeparture("");
  }, [departure, minDepartureDate]);

  function handleArrivalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value && value < minArrivalDate) return;
    setArrival(value);
    if (value && packageDayCount && packageDayCount > 0) {
      const suggestedDeparture = addDaysToDateString(value, packageDayCount - 1);
      if (suggestedDeparture && suggestedDeparture >= value) {
        setDeparture(suggestedDeparture);
      }
    }
  }

  function handleDepartureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value && value < minDepartureDate) return;
    setDeparture(value);
  }

  function orNone(value: string): string {
    return value.trim() ? value : "None specified";
  }

  function buildSummary(): string {
    const line = (label: string, value: string) => `${label}: ${orNone(value)}`;
    return [
      "SRI LANKA TOUR REQUEST",
      "=".repeat(40),
      "",
      "1. CONTACT INFORMATION",
      "-".repeat(40),
      line("Name", `${firstName} ${lastName}`.trim()),
      line("Email", email),
      line("Phone / WhatsApp", phone),
      line("Country of Residence", country),
      line("Preferred Contact Method", contactMethod),
      "",
      "2. TRIP DETAILS",
      "-".repeat(40),
      ...(selectedPackageName
        ? [line("Selected Tour Package", selectedPackageName)]
        : []),
      line("Arrival Date", arrival),
      line("Departure Date", departure),
      line("Number of Days", tripDays),
      line("Adults", adults),
      line("Infants (0-2)", String(infants)),
      line("Children (3-12)", String(children)),
      line("Teens (13-17)", String(teens)),
      line("Travelling with Pets", pets),
      ...(pets === "Yes" ? [line("Pet Details", petDetails)] : []),
      "",
      "3. DESTINATIONS",
      "-".repeat(40),
      line("Selected Destinations", destinations.join(", ")),
      line("Other Destinations", otherDestinations),
      "",
      "4. ACCOMMODATION PREFERENCES",
      "-".repeat(40),
      line("Preferred Hotel Rating", hotelRating),
      line("Preferred Room Type(s)", roomTypes.join(", ")),
      line("Meal Plan", mealPlan),
      ...(mealPlan === "Mixed Options"
        ? [line("Mixed Meal Plan Details", mixedMealDetails)]
        : []),
      "",
      "5. ACTIVITIES OF INTEREST",
      "-".repeat(40),
      line("Activities", activities.join(", ")),
      line("Other Activities", otherActivities),
      "",
      "6. DRIVER & GUIDE PREFERENCES",
      "-".repeat(40),
      line("Preferred Language", language),
      line("Driver Gender Preference", driverGender),
      line("Preferred Driver Age", driverAge),
      line("LGBTQ Friendly Driver Required?", lgbtqFriendly),
      line("Need Child Friendly Driver?", childFriendly),
      "",
      "7. FOOD & DIETARY PREFERENCES",
      "-".repeat(40),
      line("Food Preferences", foodPrefs.join(", ")),
      line("Spice Level", spiceLevel),
      line("Allergies & Medical Concerns", allergies),
      "",
      "8. CULTURAL & RELIGIOUS PREFERENCES",
      "-".repeat(40),
      line("Preferences Flagged", culturalPrefs.join(", ")),
      line("Details", culturalDetails),
      "",
      "9. BUDGET",
      "-".repeat(40),
      line("Budget (per person, per day)", budget),
      "",
      "10. DREAM TRIP",
      "-".repeat(40),
      line("Expectations / Notes", dreamTrip),
      "",
      "=".repeat(40),
      line("Terms & Privacy Policy Agreed", agreed ? "Yes" : "No"),
    ].join("\n");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const payload: Record<string, string> = {
      "First Name": firstName,
      "Last Name": lastName,
      "Email Address": email,
      "Phone / WhatsApp": orNone(phone),
      "Country of Residence": country,
      "Preferred Contact Method": contactMethod,
      ...(selectedPackageName
        ? { "Selected Tour Package": selectedPackageName }
        : {}),
      "Arrival Date": arrival,
      "Departure Date": departure,
      "Number of Days": tripDays,
      Adults: adults,
      Infants: String(infants),
      Children: String(children),
      Teens: String(teens),
      "Travelling with Pets": pets,
      "Pet Details": pets === "Yes" ? orNone(petDetails) : "N/A",
      Destinations: orNone(destinations.join(", ")),
      "Other Destinations": orNone(otherDestinations),
      "Hotel Rating": orNone(hotelRating),
      "Room Types": orNone(roomTypes.join(", ")),
      "Meal Plan": orNone(mealPlan),
      "Mixed Meal Plan Details":
        mealPlan === "Mixed Options" ? orNone(mixedMealDetails) : "N/A",
      Activities: orNone(activities.join(", ")),
      "Other Activities": orNone(otherActivities),
      "Preferred Language": orNone(language),
      "Driver Gender Preference": driverGender,
      "Preferred Driver Age": orNone(driverAge),
      "LGBTQ Friendly Driver": lgbtqFriendly,
      "Child Friendly Driver": childFriendly,
      "Food Preferences": orNone(foodPrefs.join(", ")),
      "Spice Level": orNone(spiceLevel),
      "Allergies / Medical": orNone(allergies),
      "Cultural Preferences": orNone(culturalPrefs.join(", ")),
      "Cultural Details": orNone(culturalDetails),
      Budget: orNone(budget),
      "Dream Trip": orNone(dreamTrip),
      "Terms Agreed": agreed ? "Yes" : "No",
      "Full Trip Request": buildSummary(),
    };

    try {
      const response = await fetch("/api/submit-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : `Request failed (${response.status})`
        );
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong sending your request."
      );
    } finally {
      setSubmitting(false);
    }
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
            <form onSubmit={handleSubmit} autoComplete="off">
              {selectedPackageName && (
                <div className="mb-8 rounded-xl border border-gold-200 bg-gold-50 px-5 py-4">
                  <p className="text-sm font-semibold text-forest-900">
                    Prefilled from {selectedPackageName}
                  </p>
                  <p className="mt-1 text-sm text-forest-950/65">
                    We&apos;ve filled in group size, destinations, budget, and activities
                    from this package. Choose your arrival date and we&apos;ll set your
                    departure automatically
                    {packageDayCount
                      ? ` for ${packageDayCount} days in Sri Lanka`
                      : ""}
                    . Edit anything below before submitting.
                  </p>
                </div>
              )}
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
                          min={minArrivalDate}
                          placeholder="YYYY-MM-DD"
                          onChange={handleArrivalChange}
                        />
                        <p className="mt-1 text-xs text-forest-950/50">
                          Earliest arrival: {formatDisplayDate(minArrivalDate)} (at
                          least 7 days from today)
                        </p>
                      </label>
                      <label className="block">
                        <Label required>Planned Departure Date</Label>
                        <DateInput
                          value={departure}
                          min={minDepartureDate}
                          placeholder="YYYY-MM-DD"
                          onChange={handleDepartureChange}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <Label required>Number of Days in Sri Lanka</Label>
                      <div
                        aria-live="polite"
                        className="w-full rounded-lg border border-forest-900/15 bg-cream-50 px-4 py-2.5 text-sm text-forest-950"
                      >
                        {tripDays ? (
                          <span>
                            <span className="font-semibold tabular-nums">{tripDays}</span>{" "}
                            {tripDayCount === 1 ? "day" : "days"} in Sri Lanka
                          </span>
                        ) : (
                          <span className="text-forest-950/35">
                            Select arrival and departure dates to calculate your trip length
                          </span>
                        )}
                      </div>
                      {tripDayCount !== null && tripDayCount <= 0 && (
                        <p className="mt-1 text-xs text-red-600">
                          Departure must be on or after arrival.
                        </p>
                      )}
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
                      {pets === "Yes" && (
                        <label className="mt-3 block">
                          <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                            Tell us about your pet(s)
                          </span>
                          <textarea
                            rows={2}
                            autoFocus
                            placeholder="e.g. 1 small dog, 12kg, house-trained, needs a pet-friendly villa..."
                            value={petDetails}
                            onChange={(e) => setPetDetails(e.target.value)}
                            className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                          />
                        </label>
                      )}
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
                    <div>
                      <Label>Meal Plan</Label>
                      <div className="rounded-lg border border-forest-900/15 p-3 sm:p-4">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                          {MEAL_PLANS.filter(
                            (plan) => plan.title !== "Mixed Options"
                          ).map((plan) => (
                            <label
                              key={plan.title}
                              className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 transition hover:bg-cream-50"
                            >
                              <input
                                type="radio"
                                name="mealPlan"
                                checked={mealPlan === plan.title}
                                onChange={() => setMealPlan(plan.title)}
                                className="mt-0.5 h-4 w-4 shrink-0 border-forest-900/30 text-gold-500 focus:ring-gold-400"
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-forest-900">
                                  {plan.title}
                                </span>
                                <span className="block text-xs leading-snug text-forest-950/55">
                                  {plan.subtitle}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                        <label className="mt-3 flex cursor-pointer items-start gap-2.5 border-t border-forest-900/10 px-1 pb-1 pt-3 transition hover:bg-cream-50">
                          <input
                            type="radio"
                            name="mealPlan"
                            checked={mealPlan === "Mixed Options"}
                            onChange={() => setMealPlan("Mixed Options")}
                            className="mt-0.5 h-4 w-4 shrink-0 border-forest-900/30 text-gold-500 focus:ring-gold-400"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-forest-900">
                              Mixed Options
                            </span>
                            <span className="block text-xs leading-snug text-forest-950/55">
                              Different requirements by stay
                            </span>
                          </span>
                        </label>
                      </div>
                      {mealPlan === "Mixed Options" && (
                        <label className="mt-3 block">
                          <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                            Please specify your meal plan requirements
                          </span>
                          <textarea
                            rows={3}
                            placeholder="e.g. B/B in Colombo, Half Board in the hills, Bed Only at the beach..."
                            value={mixedMealDetails}
                            onChange={(e) => setMixedMealDetails(e.target.value)}
                            className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                          />
                        </label>
                      )}
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

                    {submitError && (
                      <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {submitError}
                        {submitError === "Unauthorized" && (
                          <>
                            {" "}
                            Check that Vercel{" "}
                            <span className="font-semibold">
                              GOOGLE_APPS_SCRIPT_SECRET
                            </span>{" "}
                            matches Apps Script{" "}
                            <span className="font-semibold">SHARED_SECRET</span>.
                          </>
                        )}
                        {" "}
                        Or email{" "}
                        <a
                          href="mailto:hello@ceylonunscripted.com"
                          className="font-semibold underline"
                        >
                          hello@ceylonunscripted.com
                        </a>
                        .
                      </p>
                    )}

                    {!canSubmit && !submitting && (
                      <p className="rounded-lg border border-gold-200 bg-gold-50/80 px-4 py-2.5 text-sm text-forest-900">
                        <span className="font-semibold">
                          Scroll up to complete required fields:
                        </span>{" "}
                        {missingRequired.join(" · ")}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Send size={16} />
                      {submitting ? "Submitting..." : "Submit My Request"}
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
