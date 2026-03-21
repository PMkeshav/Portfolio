import { Link, useOutletContext } from "react-router-dom";
import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

export default function HomePage() {
  const { siteSettings } = useOutletContext();
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

  if (status === "loading") return <LoadingState label="Loading portfolio..." />;
  if (status === "error") return <ErrorState message={error} />;

  const { homePage, projects } = data;

  const preferredSlugs = homePage.featuredProjects.projectSlugs || [];
  const preferredProjects = preferredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean);
  const additionalProjects = projects.filter(
    (project) => !preferredSlugs.includes(project.slug),
  );
  const visibleProjects = [...preferredProjects, ...additionalProjects];

  return (
    <div>
      <section className="hero-section shell" id="home">
        <div className="hero-copy">
          <div className="availability-pill">
            <span className="availability-dot" />
            {homePage.hero.availabilityText}
          </div>
          <p className="hero-greeting">{homePage.hero.greeting}</p>
          <h1>
            <span className="gradient-text">{homePage.hero.name}</span>
          </h1>
          <p className="hero-title">{homePage.hero.title}</p>
          <p className="hero-bio">{homePage.hero.bio}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to={homePage.hero.primaryCta.href}>
              {homePage.hero.primaryCta.label}
            </Link>
            <a className="button button-secondary" href={homePage.hero.secondaryCta.href}>
              {homePage.hero.secondaryCta.label}
            </a>
            <a
              className="button button-secondary"
              href={siteSettings?.resumeUrl || "/assets/docs/keshav-kumar-pm.docx"}
            >
              Download C.V.
            </a>
          </div>
        </div>
        <div className="hero-media">
          <div className="portrait-stack">
            <div className="portrait-badge portrait-badge-top">🎨</div>
            <div className="portrait-frame">
              <img src={homePage.hero.photoUrl} alt={homePage.hero.name} />
            </div>
            <div className="portrait-badge portrait-badge-bottom">✨</div>
          </div>
          {homePage.hero.videoUrl ? (
            <div className="video-frame">
              <iframe
                src={homePage.hero.videoUrl}
                title="Portfolio introduction video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section shell section-soft" id="skills">
        <div className="section-heading">
          <h2>{homePage.skills.title}</h2>
        </div>
        <div className="skills-groups">
          {[...homePage.skills.groups]
            .sort((left, right) => left.displayOrder - right.displayOrder)
            .map((group) => (
              <div key={group.title} className="skill-group">
                <h3>{group.title}</h3>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="skill-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="section shell" id="projects">
        <div className="section-heading">
          <span className="eyebrow">{homePage.featuredProjects.eyebrow}</span>
          <h2>{homePage.featuredProjects.title}</h2>
          <p>{homePage.featuredProjects.description}</p>
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section shell section-soft" id="process">
        <div className="section-heading">
          <span className="eyebrow">{homePage.process.eyebrow}</span>
          <h2>{homePage.process.title}</h2>
          <p>{homePage.process.description}</p>
        </div>
        <div className="process-grid">
          {homePage.process.steps.map((step) => (
            <article key={step.stepNumber} className="process-card">
              <div className="process-number">{step.stepNumber}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="about">
        <div className="section-heading">
          <span className="eyebrow">{homePage.highlights.eyebrow}</span>
          <h2>{homePage.highlights.title}</h2>
          <p>{homePage.highlights.description}</p>
        </div>
        <div className="highlights-grid">
          {homePage.highlights.items.map((item) => (
            <article key={item.title} className="highlight-card">
              <div className="highlight-emoji">{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell contact-section" id="contact">
        <div className="section-heading section-heading-center">
          <h2>{homePage.contact.title}</h2>
          <p>{homePage.contact.description}</p>
        </div>
        <div className="contact-actions">
          <a className="button button-primary" href={`mailto:${homePage.contact.ctaEmail}`}>
            {homePage.contact.ctaLabel}
          </a>
        </div>
        <p className="contact-caption">
          or email me directly at{" "}
          <a href={`mailto:${homePage.contact.ctaEmail}`}>{homePage.contact.ctaEmail}</a>
        </p>
      </section>
    </div>
  );
}
