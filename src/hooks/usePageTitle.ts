import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyFavicon } from "../lib/favicon";
import { documentTitleForPath } from "../lib/pageTitles";
import { applySiteMeta } from "../lib/siteMeta";

export default function usePageTitle() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.title = documentTitleForPath(pathname);
    applySiteMeta(pathname);
    applyFavicon();
  }, [pathname]);
}
