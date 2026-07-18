const FAVICON_VERSION = "4";

type FaviconLink = {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
};

const FAVICON_LINKS: FaviconLink[] = [
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: `/favicon-32.png?v=${FAVICON_VERSION}`,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "48x48",
    href: `/favicon-48.png?v=${FAVICON_VERSION}`,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "180x180",
    href: `/favicon.png?v=${FAVICON_VERSION}`,
  },
  {
    rel: "icon",
    href: `/favicon.ico?v=${FAVICON_VERSION}`,
    sizes: "any",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: `/apple-touch-icon.png?v=${FAVICON_VERSION}`,
  },
];

function upsertLink(def: FaviconLink) {
  const selector = def.sizes
    ? `link[rel='${def.rel}'][sizes='${def.sizes}']`
    : `link[rel='${def.rel}']`;

  let link = document.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement("link");
    link.rel = def.rel;
    if (def.type) link.type = def.type;
    if (def.sizes) link.sizes = def.sizes;
    document.head.appendChild(link);
  }

  link.href = def.href;
}

/** Ensures tab icons always point at the Ceylon Unscripted shell favicon. */
export function applyFavicon() {
  for (const def of FAVICON_LINKS) {
    upsertLink(def);
  }
}
