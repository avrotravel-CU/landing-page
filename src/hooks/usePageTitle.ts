import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { documentTitleForPath } from "../lib/pageTitles";

export default function usePageTitle() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.title = documentTitleForPath(pathname);
  }, [pathname]);
}
