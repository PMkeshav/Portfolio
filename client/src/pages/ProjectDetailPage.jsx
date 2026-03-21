import { Link, useParams } from "react-router-dom";
import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, status, error } = useLiveLoader(
    () => contentApi.getProject(slug),
    { intervalMs: 4000, enabled: Boolean(slug) },
  );

  if (status === "loading") return <LoadingState label="Loading case study..." />;
  if (status === "error") return <ErrorState message={error} />;

  return (
    <section className="section shell project-detail">
      <Link className="text-link back-link" to="/work">
        Back to all projects
      </Link>
      <div
        className="project-hero"
        style={{
          background: `linear-gradient(135deg, ${project.heroMedia.gradientFrom}, ${project.heroMedia.gradientTo})`,
        }}
      >
        {project.heroMedia.imageUrl ? (
          <img src={project.heroMedia.imageUrl} alt={project.title} className="project-hero-image" />
        ) : (
          <span>{project.heroMedia.emoji || "✨"}</span>
        )}
      </div>
      <div className="project-detail-header">
        <div className="pill-row">
          {project.statusLabel ? <span className="pill pill-primary">{project.statusLabel}</span> : null}
          {project.category ? <span className="pill">{project.category}</span> : null}
        </div>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="detail-grid">
        <article className="detail-card">
          <h2>Problem Statement</h2>
          <p>{project.problem}</p>
        </article>
        <article className="detail-card">
          <h2>Solution</h2>
          <p>{project.solution}</p>
        </article>
      </div>
      <section className="detail-section">
        <h2>Wireframes & Design</h2>
        <div className="wireframe-grid">
          {project.wireframes.map((item, index) => (
            <article className="wireframe-card" key={`${item.name}-${index}`}>
              <div className="wireframe-index">{index + 1}</div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="detail-section">
        <h2>Impact & Results</h2>
        <div className="impact-grid">
          {project.impactMetrics.map((item) => (
            <article className="impact-card" key={`${item.metric}-${item.label}`}>
              <strong>{item.metric}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
