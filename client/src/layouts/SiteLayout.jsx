import { Outlet } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { contentApi } from "../api/contentApi.js";
import { useEffect } from "react";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function SiteLayout() {
  const {
    data: siteSettings,
    status,
    error,
  } = useLiveLoader(() => contentApi.getSiteSettings(), { intervalMs: 4000 });

  useEffect(() => {
    if (siteSettings) {
      applyTheme(siteSettings);
    }
  }, [siteSettings]);

  if (status === "loading") return <LoadingState label="Loading site settings..." />;
  if (status === "error") return <ErrorState message={error} />;

  return (
    <div className="site-frame">
      <Header siteSettings={siteSettings} />
      <main>
        <Outlet context={{ siteSettings }} />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}

function applyTheme(siteSettings) {
  const theme = siteSettings?.theme;
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primaryColor);
  root.style.setProperty("--color-secondary", theme.secondaryColor);
  root.style.setProperty("--color-background", theme.backgroundColor);
  root.style.setProperty("--color-surface", theme.surfaceColor);
  root.style.setProperty("--color-text", theme.textColor);
  root.style.setProperty("--color-muted", theme.mutedTextColor);
  root.style.setProperty("--gradient-from", theme.accentGradientFrom);
  root.style.setProperty("--gradient-to", theme.accentGradientTo);
  root.style.setProperty("--font-display", theme.fontDisplay);
  root.style.setProperty("--font-body", theme.fontBody);
}
