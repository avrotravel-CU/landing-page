import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/shell-icon.png";
import { pageTitleForPath } from "../lib/pageTitles";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tour Packages", href: "/tour-packages" },
  { label: "Experiences", href: "/experiences" },
  { label: "Payments", href: "/payments" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const pageName = pageTitleForPath(pathname);

  const isActive = (href: string) => href === pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Ceylon Unscripted"
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <span className="min-w-0 truncate text-sm font-semibold text-forest-900 sm:text-[15px]">
            Ceylon Unscripted - {pageName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={
                isActive(link.href)
                  ? "text-sm font-medium text-gold-500"
                  : "text-sm font-medium text-forest-900/80 transition hover:text-forest-900"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/plan"
          className="hidden rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gold-600 lg:inline-block"
        >
          Plan My Trip
        </Link>

        <button
          aria-label="Toggle menu"
          className="text-forest-900 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-100 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className={
                  isActive(link.href)
                    ? "text-sm font-medium text-gold-500"
                    : "text-sm font-medium text-forest-900/80"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/plan"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block rounded-full bg-gold-500 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Plan My Trip
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
