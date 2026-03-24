import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      let attemptCount = 0;
      let timeoutId = 0;

      const scrollToHash = () => {
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        if (attemptCount < 20) {
          attemptCount += 1;
          timeoutId = window.setTimeout(scrollToHash, 120);
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };

      timeoutId = window.setTimeout(scrollToHash, 0);

      return () => window.clearTimeout(timeoutId);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
