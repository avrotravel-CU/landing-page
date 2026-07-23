import { SITE_NAME } from "../lib/siteBranding";

const INSTAGRAM_URL = "https://www.instagram.com/ceylon.unscripted/";

export default function Footer() {
  return (
    <footer id="contact" className="bg-peach-100">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-forest-900/70 transition hover:text-gold-600"
        >
          Follow {SITE_NAME} on Instagram
        </a>
        <p className="mt-3 text-xs text-forest-950/50">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
