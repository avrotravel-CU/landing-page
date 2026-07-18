import { SHELL_FAVICON_DATA_URL } from "./faviconData";

/** Ensures the browser tab uses the Ceylon Unscripted shell logo. */
export function applyFavicon() {
  const links: Array<{ rel: string; type?: string; href: string }> = [
    { rel: "icon", type: "image/png", href: SHELL_FAVICON_DATA_URL },
    { rel: "shortcut icon", type: "image/png", href: SHELL_FAVICON_DATA_URL },
    { rel: "apple-touch-icon", href: SHELL_FAVICON_DATA_URL },
  ];

  document
    .querySelectorAll<HTMLLinkElement>(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
    )
    .forEach((link) => link.remove());

  for (const def of links) {
    const link = document.createElement("link");
    link.rel = def.rel;
    link.href = def.href;
    if (def.type) link.type = def.type;
    document.head.appendChild(link);
  }
}

export { SHELL_FAVICON_DATA_URL };
