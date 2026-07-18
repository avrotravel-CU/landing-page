import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { documentTitleForPath } from "../lib/pageTitles";

export default function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = documentTitleForPath(pathname);
  }, [pathname]);
}
