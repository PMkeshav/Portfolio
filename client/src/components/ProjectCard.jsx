import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  const wireframesWithFigma = (project.wireframes || []).filter(
    (wireframe) => wireframe.figmaUrl,
  );

  return (
    <article className="project-card">
      <div className="project-card-body">
        <div className="pill-row">
          {project.statusLabel ? <span className="pill pill-primary">{project.statusLabel}</span> : null}
          {project.category ? <span className="pill">{project.category}</span> : null}
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        {wireframesWithFigma.length ? (
          <div className="project-card-figma-links">
            <span>Figma designs</span>
            <div className="project-card-figma-link-list">
              {wireframesWithFigma.map((wireframe, index) => (
                <a
                  key={`${wireframe.name}-${index}`}
                  href={wireframe.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  {wireframe.name || `Wireframe ${index + 1}`} ↗
                </a>
              ))}
            </div>
          </div>
        ) : null}
        <Link to={`/work/${project.slug}`} className="text-link project-card-case-study-link">
          View case study →
        </Link>
      </div>
    </article>
  );
}
