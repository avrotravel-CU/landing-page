import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="bg-peach-100">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <p className="text-xs text-forest-950/50">
          <Link
            to="/privacy"
            className="font-medium text-forest-950/65 transition hover:text-gold-600 hover:underline"
          >
            Privacy Statement
          </Link>
          <span className="mx-2">·</span>
          © {new Date().getFullYear()} Ceylon Unscripted. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
