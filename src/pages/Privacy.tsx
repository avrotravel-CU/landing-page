import { Shield } from "lucide-react";
import LegalSectionsContent from "../components/LegalSectionsContent";
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_STATEMENT_TITLE,
} from "../data/privacyStatement";

export default function Privacy() {
  return (
    <main className="bg-cream-100">
      <section className="bg-forest-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center lg:py-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-400">
            <Shield size={13} /> Your Data, Protected
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            {PRIVACY_STATEMENT_TITLE}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
            How we collect, use, and safeguard your personal information.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-sm leading-relaxed text-forest-950/70">
              {PRIVACY_INTRO}
            </p>
            <hr className="my-6 border-forest-900/10" />
            <LegalSectionsContent sections={PRIVACY_SECTIONS} />
          </div>
        </div>
      </section>
    </main>
  );
}
