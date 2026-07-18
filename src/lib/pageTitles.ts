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
  return `Ceylon Unscripted - ${pageTitleForPath(pathname)}`;
}
