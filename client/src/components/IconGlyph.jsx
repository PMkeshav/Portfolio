const iconPaths = {
  spark: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 4l.7 2.3L22 7l-2.3.7L19 10l-.7-2.3L16 7l2.3-.7L19 4z" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  chat: (
    <>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v5A2.5 2.5 0 0 1 16.5 14H11l-4 3v-3H7.5A2.5 2.5 0 0 1 5 11.5v-5z" />
      <path d="M8.5 8.5h7M8.5 11h5" />
    </>
  ),
  folder: (
    <>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2h7A2.5 2.5 0 0 1 20.5 9.5v7A2.5 2.5 0 0 1 18 19H6A2.5 2.5 0 0 1 3.5 16.5v-9z" />
    </>
  ),
  graduation: (
    <>
      <path d="M3 9l9-4 9 4-9 4-9-4z" />
      <path d="M7 11.5v3.2c0 1.7 2.2 3.3 5 3.3s5-1.6 5-3.3v-3.2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M6.5 5.5A2.5 2.5 0 0 1 9 3h8.5v17H9a2.5 2.5 0 0 0-2.5 2.5V5.5z" />
      <path d="M6.5 5.5A2.5 2.5 0 0 0 4 8v11.5h11" />
    </>
  ),
  film: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 5v14M16 5v14M4 9h16M4 15h16" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 16.5V20h3.5L18 9.5 14.5 6 4 16.5z" />
      <path d="M13.5 7l3.5 3.5" />
    </>
  ),
  puzzle: (
    <>
      <path d="M9 4a2 2 0 1 1 4 0h3v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 1-4 0H4v-4a2 2 0 1 1 0-4V4h5z" />
    </>
  ),
  palette: (
    <>
      <path d="M12 4a8 8 0 1 0 0 16h1.2a2.3 2.3 0 0 0 0-4.6h-1.1a1.7 1.7 0 0 1 0-3.4H14A4 4 0 0 0 18 8V7.8A3.8 3.8 0 0 0 14.2 4H12z" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function getProjectIconKey(project) {
  const category = `${project?.category || ""} ${project?.title || ""}`.toLowerCase();

  if (category.includes("support") || category.includes("chat")) return "chat";
  if (category.includes("portal")) return "folder";
  if (category.includes("course") || category.includes("trainer") || category.includes("university")) return "graduation";
  return "grid";
}

export function getHighlightIconKey(title = "") {
  const value = title.toLowerCase();

  if (value.includes("book")) return "book";
  if (value.includes("movie") || value.includes("film")) return "film";
  if (value.includes("usability")) return "pencil";
  if (value.includes("problem")) return "puzzle";
  if (value.includes("design")) return "palette";
  if (value.includes("motorcycle") || value.includes("rider")) return "target";
  return "spark";
}

export default function IconGlyph({ icon = "spark", className = "" }) {
  return (
    <span className={`icon-glyph ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths[icon] || iconPaths.spark}
      </svg>
    </span>
  );
}
