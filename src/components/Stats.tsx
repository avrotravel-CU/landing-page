const STATS = [
  { value: "500+", label: "Happy Travellers" },
  { value: "10+", label: "Years Experience" },
  { value: "100%", label: "Customised Tours" },
  { value: "24h", label: "Response Time" },
];

export default function Stats() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 text-center sm:grid-cols-4 lg:px-10">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="font-serif text-2xl font-bold text-gold-500 sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-forest-950/60 sm:text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
