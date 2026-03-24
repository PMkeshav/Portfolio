import { useMemo, useState } from "react";
import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import RevealSection from "../components/RevealSection.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data, status, error } = useLiveLoader(
    async () => {
      const [homePage, projects] = await Promise.all([
        contentApi.getHomePage(),
        contentApi.getProjects(),
      ]);

      return { homePage, projects };
    },
    { intervalMs: 4000 },
  );
  const homePage = data?.homePage;
  const projects = data?.projects || [];
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects],
  );
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  if (status === "loading") return <LoadingState label="Loading projects..." />;
  if (status === "error") return <ErrorState message={error} />;
  if (!homePage) return <ErrorState message="Work page data is unavailable." />;

  return (
    <div className="work-redesign section shell">
      <RevealSection className="work-filter-bar">
        <div className="work-filter-copy">
          <h2>Browse the portfolio</h2>
          <p>Filter by category to focus on the kind of product work you want to review.</p>
        </div>
        <div className="work-filter-pills">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`work-filter-pill ${activeFilter === category ? "is-active" : ""}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="work-grid-shell">
        <div className="work-grid-heading">
          <span className="carousel-caption">
            Showing {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="project-grid project-grid-redesign">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </RevealSection>
    </div>
  );
}
