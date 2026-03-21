import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div
        className="project-card-visual"
        style={{
          background: `linear-gradient(135deg, ${project.heroMedia.gradientFrom}, ${project.heroMedia.gradientTo})`,
        }}
      >
        {project.heroMedia.imageUrl ? (
          <img src={project.heroMedia.imageUrl} alt={project.title} className="project-card-image" />
        ) : (
          <span>{project.heroMedia.emoji || "✨"}</span>
        )}
      </div>
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
        <Link to={`/work/${project.slug}`} className="text-link">
          Read Case Study
        </Link>
      </div>
    </article>
  );
}
