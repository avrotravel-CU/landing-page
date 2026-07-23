import { SITE_NAME } from "./siteBranding";

export const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/tour-packages": "Tour Packages",
  "/experiences": "Experiences",
  "/payments": "Payments",
  "/payment-success": "Payment Success",
  "/payment-declined": "Payment Declined",
  "/contact": "Contact Us",
  "/plan": "Plan My Trip",
};

export function pageTitleForPath(pathname: string): string {
  return PAGE_TITLES[pathname] ?? "Home";
}

export function documentTitleForPath(pathname: string): string {
  if (pathname === "/") return SITE_NAME;
  return `${pageTitleForPath(pathname)}, ${SITE_NAME}`;
}
