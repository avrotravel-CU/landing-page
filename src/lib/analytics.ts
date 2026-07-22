declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function getGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
}

export function isGoogleAnalyticsConfigured() {
  return Boolean(getGaMeasurementId());
}

export function initGoogleAnalytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId || initialized) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => {
    trackPageView(
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    );
  };
  document.head.appendChild(script);
}

export function trackPageView(path: string) {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window.gtag !== "function") return;

  // GA4 recommended SPA approach — updates page_path on each route change.
  window.gtag("config", measurementId, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!getGaMeasurementId() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
