import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const wireframesWithFigma = (project.wireframes || []).filter(
    (wireframe) => wireframe.figmaUrl,
  );

  function openProject(event) {
    if (event.target.closest("a")) return;
    navigate(`/work/${project.slug}`);
  }

  function openProjectWithKeyboard(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/work/${project.slug}`);
    }
  }

  return (
    <article
      className="project-card project-card-link"
      role="link"
      tabIndex={0}
      onClick={openProject}
      onKeyDown={openProjectWithKeyboard}
      aria-label={`Open ${project.title} project details`}
    >
      <div className="project-card-body">
        <div className="pill-row">
          {project.category ? <span className="pill pill-category">{project.category}</span> : null}
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
      </div>
    </article>
  );
}
