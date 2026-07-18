import shellFavicon from "../assets/shell-icon.png";

const FAVICON_VERSION = "5";
const PUBLIC_FAVICON = `/ceylon-shell-icon.png?v=${FAVICON_VERSION}`;

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
    href: shellFavicon,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: `/favicon-32.png?v=${FAVICON_VERSION}`,
  },
  {
    rel: "apple-touch-icon",
    href: PUBLIC_FAVICON,
  },
];

function removeStaleIconLinks() {
  document
    .querySelectorAll<HTMLLinkElement>(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
    )
    .forEach((link) => link.remove());
}

function upsertLink(def: FaviconLink) {
  const selector = def.sizes
    ? `link[rel='${def.rel}'][sizes='${def.sizes}']`
    : `link[rel='${def.rel}']:not([sizes])`;

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
  removeStaleIconLinks();

  for (const def of FAVICON_LINKS) {
    upsertLink(def);
  }
}

export { PUBLIC_FAVICON };
