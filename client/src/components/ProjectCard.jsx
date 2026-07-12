import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="project-card project-card-link">
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
      </div>
    </Link>
  );
}
