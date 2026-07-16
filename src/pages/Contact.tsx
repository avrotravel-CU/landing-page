import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.87h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.87h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.9s-.23-1.64-.94-2.36c-.9-.94-1.9-.9-2.36-.96C16.9 3.3 12 3.3 12 3.3h-.01s-4.89 0-8.2.28c-.46.06-1.46.02-2.36.96C.73 5.26.5 6.9.5 6.9S.25 8.83.25 10.76v1.87c0 1.93.25 3.86.25 3.86s.23 1.64.94 2.36c.9.94 2.08.87 2.6.97 1.9.18 8.06.3 8.06.3s4.9-.01 8.2-.29c.46-.06 1.46-.02 2.36-.96.71-.72.94-2.36.94-2.36s.25-1.93.25-3.86v-1.87c0-1.93-.25-3.86-.25-3.86ZM9.7 15V8.7l6.01 3.15Z" />
    </svg>
  );
}

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+94776718241",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@ceylonunscripted.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Dambuwa Watta, Imbulgoda, Gampaha",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Sat, 8am–6pm (IST)",
  },
];

const SOCIAL_LINKS = [
  {
    icon: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/CeylonUnscripted",
  },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: YoutubeIcon, label: "YouTube" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="bg-cream-100">
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            Get In Touch
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            We're real people who love Sri Lanka. Drop us a message and
            we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-xl font-bold text-forest-900">
                Find Us
              </h2>

              <div className="mt-5 space-y-5">
                {CONTACT_DETAILS.map((d) => (
                  <div key={d.label} className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                      <d.icon size={19} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-forest-900">
                        {d.label}
                      </p>
                      <p className="text-sm text-forest-950/60">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl bg-peach-100 p-5">
                <h3 className="text-sm font-bold text-forest-900">
                  Response Guarantee
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-forest-950/65">
                  Every message gets a personal reply, not a bot, not a
                  template. We aim to respond within 24 hours, usually much
                  faster.
                </p>
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-bold text-forest-900">
                  Find us on
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href ?? "#"}
                      {...(s.href
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : { onClick: (e) => e.preventDefault() })}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-4 py-2 text-sm font-medium text-forest-950/70 transition hover:border-gold-400 hover:text-forest-900"
                    >
                      <s.icon size={16} />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-serif text-xl font-bold text-forest-900">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="mt-6 rounded-xl bg-gold-50 p-6 text-center">
                    <p className="text-sm font-semibold text-forest-900">
                      Thanks for reaching out!
                    </p>
                    <p className="mt-1.5 text-sm text-forest-950/60">
                      We've received your message and will get back to you
                      within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                          First Name <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          placeholder="First Name"
                          className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                          Last Name <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          placeholder="Last Name"
                          className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                        Email Address <span className="text-red-500">*</span>
                      </span>
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                        Phone / WhatsApp
                      </span>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                        Subject
                      </span>
                      <input
                        defaultValue="General Enquiry"
                        className="w-full rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 outline-none transition focus:border-gold-400"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-forest-900">
                        Message <span className="text-red-500">*</span>
                      </span>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us how we can help..."
                        className="w-full resize-none rounded-lg border border-forest-900/15 px-4 py-2.5 text-sm text-forest-950 placeholder:text-forest-950/35 outline-none transition focus:border-gold-400"
                      />
                    </label>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600"
                    >
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
