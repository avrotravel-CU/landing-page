import {
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TAGLINE,
  SITE_URL,
} from "./siteBranding";

const META = {
  description: "description",
  ogTitle: "og:title",
  ogDescription: "og:description",
  ogUrl: "og:url",
  ogImage: "og:image",
  ogType: "og:type",
  twitterCard: "twitter:card",
  twitterTitle: "twitter:title",
  twitterDescription: "twitter:description",
  twitterImage: "twitter:image",
} as const;

function upsertMeta(property: string, content: string, isProperty = true) {
  const selector = isProperty
    ? `meta[property="${property}"]`
    : `meta[name="${property}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    if (isProperty) {
      element.setAttribute("property", property);
    } else {
      element.setAttribute("name", property);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

export function applySiteMeta(pathname: string) {
  const pageUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  upsertMeta(META.description, SITE_TAGLINE, false);
  upsertMeta(META.ogTitle, SITE_NAME);
  upsertMeta(META.ogDescription, SITE_TAGLINE);
  upsertMeta(META.ogUrl, pageUrl);
  upsertMeta(META.ogImage, SITE_OG_IMAGE);
  upsertMeta(META.ogType, "website");
  upsertMeta(META.twitterCard, "summary_large_image", false);
  upsertMeta(META.twitterTitle, SITE_NAME, false);
  upsertMeta(META.twitterDescription, SITE_TAGLINE, false);
  upsertMeta(META.twitterImage, SITE_OG_IMAGE, false);
}
