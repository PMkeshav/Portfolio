import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function WorkPage() {
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

  if (status === "loading") return <LoadingState label="Loading projects..." />;
  if (status === "error") return <ErrorState message={error} />;

  const { homePage, projects } = data;

  return (
    <section className="section shell">
      <div className="section-heading section-heading-center">
        <span className="eyebrow">{homePage?.featuredProjects?.eyebrow}</span>
        <h1>{homePage?.featuredProjects?.title}</h1>
        <p>{homePage?.featuredProjects?.description}</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
