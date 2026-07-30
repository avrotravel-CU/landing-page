declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: Gtag;
  }
}

type Gtag = {
  (...args: unknown[]): void;
  (command: "js", date: Date): void;
  (command: "config", targetId: string, params?: Record<string, unknown>): void;
  (command: "event", eventName: string, params?: Record<string, unknown>): void;
};

let initialized = false;
let gtagReady = false;
let pendingPageView: string | null = null;

export function getGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
}

export function isGoogleAnalyticsConfigured() {
  return Boolean(getGaMeasurementId());
}

function sendPageView(path: string) {
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function initGoogleAnalytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId || initialized) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];

  // Match Google's snippet — push the Arguments object, not a spread array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  } as Gtag;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => {
    gtagReady = true;
    if (pendingPageView !== null) {
      sendPageView(pendingPageView);
      pendingPageView = null;
    }
  };
  document.head.appendChild(script);
}

export function trackPageView(path: string) {
  if (!getGaMeasurementId() || typeof window.gtag !== "function") return;

  if (!gtagReady) {
    pendingPageView = path;
    return;
  }

  sendPageView(path);
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!getGaMeasurementId() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
