import { useEffect, useRef, useState } from "react";

export function useLiveLoader(loader, options = {}) {
  const { intervalMs = 5000, enabled = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const loaderRef = useRef(loader);
  const mountedRef = useRef(true);
  const isFirstLoadRef = useRef(true);

  loaderRef.current = loader;

  useEffect(() => {
    mountedRef.current = true;

    async function run({ background = false } = {}) {
      try {
        if (!background && isFirstLoadRef.current) {
          setStatus("loading");
        }

        const nextData = await loaderRef.current();

        if (!mountedRef.current) return;

        setData(nextData);
        setError("");
        setStatus("ready");
        isFirstLoadRef.current = false;
      } catch (requestError) {
        if (!mountedRef.current) return;

        setError(requestError.message);
        setStatus(isFirstLoadRef.current ? "error" : "ready");
      }
    }

    if (enabled) {
      run();
    }

    const intervalId = enabled
      ? window.setInterval(() => {
          run({ background: true });
        }, intervalMs)
      : null;

    const handleVisibilityChange = () => {
      if (enabled && document.visibilityState === "visible") {
        run({ background: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs]);

  return { data, status, error, setData };
}

