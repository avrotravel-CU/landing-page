import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyFavicon } from "../lib/favicon";
import { documentTitleForPath } from "../lib/pageTitles";

export default function usePageTitle() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.title = documentTitleForPath(pathname);
    applyFavicon();
  }, [pathname]);
}
