import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { contentApi } from "../api/contentApi.js";
import ErrorState from "../components/ErrorState.jsx";
import IconGlyph, { getHighlightIconKey } from "../components/IconGlyph.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import RevealSection from "../components/RevealSection.jsx";
import { useLiveLoader } from "../hooks/useLiveLoader.js";

const PROJECTS_PER_PAGE = 4;

export default function HomePage() {
  const { siteSettings } = useOutletContext();
  const [projectPage, setProjectPage] = useState(0);
  const [typedName, setTypedName] = useState("");
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

  const orderedProjects = useMemo(() => {
    const featuredProjects = projects.filter((project) => project.featured);
    const additionalProjects = projects.filter((project) => !project.featured);
    return [...featuredProjects, ...additionalProjects];
  }, [projects]);
  const projectPageCount = Math.max(1, Math.ceil(orderedProjects.length / PROJECTS_PER_PAGE));
  const visibleProjects = orderedProjects.slice(
    projectPage * PROJECTS_PER_PAGE,
    projectPage * PROJECTS_PER_PAGE + PROJECTS_PER_PAGE,
  );

  useEffect(() => {
    setProjectPage((currentPage) => Math.min(currentPage, projectPageCount - 1));
  }, [projectPageCount]);

  useEffect(() => {
    if (!homePage?.hero?.name) {
      setTypedName("");
      return;
    }

    const fullName = homePage.hero.name;
    let frameId = 0;
    let timeoutId = 0;
    let index = 0;

    const typeNext = () => {
      setTypedName(fullName.slice(0, index + 1));
      index += 1;

      if (index < fullName.length) {
        timeoutId = window.setTimeout(() => {
          frameId = window.requestAnimationFrame(typeNext);
        }, 70);
      }
    };

    setTypedName("");
    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(typeNext);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [homePage?.hero?.name]);

  if (status === "loading") return <LoadingState label="Loading portfolio..." />;
  if (status === "error") return <ErrorState message={error} />;
  if (!homePage) return <ErrorState message="Home page data is unavailable." />;

  return (
    <div className="home-redesign">
      <section className="hero-redesign shell" id="home">
        <div className="hero-redesign-copy">
          <p className="hero-redesign-intro">{homePage.hero.greeting}</p>
          <div className="hero-typewriter" aria-label={homePage.hero.name}>
            <span className="hero-typewriter-prefix">I am </span>
            <span className="hero-typewriter-name">{typedName}</span>
            <span className="hero-typewriter-caret" />
          </div>
          <h1 className="hero-redesign-title">
            <span className="hero-redesign-line">I design products that</span>
            <span className="gradient-text"> move from ambiguity to action.</span>
          </h1>
          <p className="hero-redesign-role">{homePage.hero.title}</p>
          <p className="hero-redesign-bio">{homePage.hero.bio}</p>
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

        <div className="hero-redesign-visual">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
         {/* <div className="hero-profile-panel"> */}
            <div className="hero-profile-topline">
            </div>
            <div className="hero-profile-portrait">
              <img src={homePage.hero.photoUrl} alt={homePage.hero.name} />
            </div>
            <div className="hero-profile-body">
              <div className="hero-video-outline" aria-label="YouTube video placeholder">
                <div className="hero-video-outline-topbar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-video-outline-body">
                  <div className="hero-video-play">▶</div>
                  <strong>Video in progress, coming soon</strong>
                </div>
              </div>
            </div>
         {/* comment here  </div> */}
        </div>
      </section>

      <RevealSection className="section shell skill-band section-soft" id="skills">
        <div className="section-heading">
          <span className="eyebrow">Capabilities</span>
          <h2>{homePage.skills.title}</h2>
          <p>Cross-functional thinking, product clarity, and user-centered execution brought into one working rhythm.</p>
        </div>
        <div className="skills-editorial-grid">
          {[...homePage.skills.groups]
            .sort((left, right) => left.displayOrder - right.displayOrder)
            .map((group, index) => (
              <article key={group.title} className={`skills-editorial-card skills-editorial-card-${(index % 3) + 1}`}>
                <div className="skills-editorial-index">0{index + 1}</div>
                <h3>{group.title}</h3>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="skill-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
        </div>
      </RevealSection>

      <RevealSection className="section shell featured-work-shell" id="projects">
        <div className="featured-work-header">
          <div className="section-heading">
            <span className="eyebrow">{homePage.featuredProjects.eyebrow}</span>
            <h2>{homePage.featuredProjects.title}</h2>
            <p>{homePage.featuredProjects.description}</p>
          </div>
          <div className="carousel-toolbar">
            <span className="carousel-caption">
              Curated page {projectPage + 1} of {projectPageCount}
            </span>
            <div className="carousel-actions">
              <button
                className="button button-secondary button-compact"
                type="button"
                onClick={() => setProjectPage((page) => Math.max(page - 1, 0))}
                disabled={projectPage === 0}
              >
                Previous
              </button>
              <button
                className="button button-secondary button-compact"
                type="button"
                onClick={() => setProjectPage((page) => Math.min(page + 1, projectPageCount - 1))}
                disabled={projectPage >= projectPageCount - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="project-grid project-grid-redesign">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section shell process-redesign section-soft" id="process">
        <div className="section-heading">
          <span className="eyebrow">{homePage.process.eyebrow}</span>
          <h2>{homePage.process.title}</h2>
          <p>{homePage.process.description}</p>
        </div>
        <div className="process-timeline">
          {homePage.process.steps.map((step) => (
            <article key={step.stepNumber} className="process-timeline-card">
              <div className="process-timeline-number">{step.stepNumber}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section shell" id="about">
        <div className="section-heading">
          <span className="eyebrow">{homePage.highlights.eyebrow}</span>
          <h2>{homePage.highlights.title}</h2>
          <p>{homePage.highlights.description}</p>
        </div>
        <div className="highlights-editorial-grid">
          {homePage.highlights.items.map((item) => (
            <article key={item.title} className="highlight-card highlight-card-redesign">
              <div className="highlight-emoji">
                <IconGlyph icon={getHighlightIconKey(item.title)} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <section className="section shell contact-redesign" id="contact">
        <div className="contact-redesign-card">
          <div className="section-heading">
            <span className="eyebrow">Let’s build</span>
            <h2>{homePage.contact.title}</h2>
            <p>{homePage.contact.description}</p>
          </div>
          <div className="contact-actions">
            <a className="button button-primary" href={`mailto:${homePage.contact.ctaEmail}`}>
              {homePage.contact.ctaLabel}
            </a>
            <a className="button button-secondary" href={`mailto:${homePage.contact.ctaEmail}`}>
              {homePage.contact.ctaEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
