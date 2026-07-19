import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [wireframePage, setWireframePage] = useState(0);
  const [previewWireframe, setPreviewWireframe] = useState(null);
  const { data: project, status, error } = useLiveLoader(
    () => contentApi.getProject(slug),
    { intervalMs: 4000, enabled: Boolean(slug) },
  );
  const wireframes = project?.wireframes || [];
  const wireframePageCount = Math.max(1, Math.ceil(wireframes.length / 2));
  const visibleWireframes = useMemo(
    () => wireframes.slice(wireframePage * 2, wireframePage * 2 + 2),
    [wireframes, wireframePage],
  );

  useEffect(() => {
    setWireframePage(0);
    setPreviewWireframe(null);
  }, [slug]);

  useEffect(() => {
    if (!previewWireframe) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setPreviewWireframe(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewWireframe]);

  useEffect(() => {
    setWireframePage((page) => Math.min(page, wireframePageCount - 1));
  }, [wireframePageCount]);

  if (status === "loading") return <LoadingState label="Loading case study..." />;
  if (status === "error" || !project) {
    return <ErrorState message={error || "This project is unavailable."} />;
  }

  return (
    <section className="section shell project-detail">
      <Link className="text-link back-link" to="/work">
        Back to all projects
      </Link>
      <div className="project-detail-header">
        <div className="pill-row">
          {project.category ? <span className="pill pill-category">{project.category}</span> : null}
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
      <section className="detail-section">
        <div className="wireframe-section-header">
          <h2>Wireframes & Design</h2>
          {wireframes.length > 2 ? (
            <div className="carousel-toolbar wireframe-pagination">
              <span className="carousel-caption">Page {wireframePage + 1} of {wireframePageCount}</span>
              <div className="carousel-actions">
                <button className="button button-secondary button-compact" type="button" onClick={() => setWireframePage((page) => page - 1)} disabled={wireframePage === 0}>Previous</button>
                <button className="button button-secondary button-compact" type="button" onClick={() => setWireframePage((page) => page + 1)} disabled={wireframePage >= wireframePageCount - 1}>Next</button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="wireframe-grid">
          {visibleWireframes.map((item, index) => (
            <article className="wireframe-card" key={`${item.name}-${index}`}>
              {item.imageUrl ? (
                <button
                  className="wireframe-image-button"
                  type="button"
                  onClick={() => setPreviewWireframe(item)}
                  aria-label={`Preview ${item.name} wireframe`}
                >
                  <img className="wireframe-image" src={item.imageUrl} alt={`${item.name} wireframe`} />
                  <span>View full image</span>
                </button>
              ) : <div className="wireframe-index">{wireframePage * 2 + index + 1}</div>}
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.figmaUrl ? (
                <a
                  className="button button-secondary button-compact"
                  href={item.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Figma
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      {previewWireframe ? (
        <div
          className="image-preview-backdrop"
          role="presentation"
          onClick={() => setPreviewWireframe(null)}
        >
          <div
            className="image-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${previewWireframe.name} full-size wireframe`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-preview-close"
              type="button"
              onClick={() => setPreviewWireframe(null)}
              aria-label="Close image preview"
            >
              ×
            </button>
            <img src={previewWireframe.imageUrl} alt={`${previewWireframe.name} wireframe`} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
