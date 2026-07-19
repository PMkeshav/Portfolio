import { useEffect, useMemo, useRef, useState } from "react";
import { contentApi } from "../api/contentApi.js";
import {
  arrayToNewlineList,
  createEmptyProject,
  multilineToObjectList,
  newlineListToArray,
  objectListToMultiline,
} from "../utils/forms.js";
import { downloadProjectsDocx } from "../utils/projectDocx.js";

export default function AdminPage() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [homePage, setHomePage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [productSkillsText, setProductSkillsText] = useState("");
  const [technicalSkillsText, setTechnicalSkillsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [processStepsText, setProcessStepsText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("new");
  const [projectForm, setProjectForm] = useState(createEmptyProject());
  const [status, setStatus] = useState("locked");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [error, setError] = useState("");
  const noticeTimeoutRef = useRef(null);

  useEffect(() => {
    const savedKey = window.localStorage.getItem("portfolioAdminKey") || "";

    if (!savedKey) {
      return;
    }

    setAdminKey(savedKey);
    setKeyInput(savedKey);
    refresh(savedKey);
  }, []);

  const selectedProject = useMemo(
    () => projects.find((item) => item._id === selectedProjectId) || null,
    [projects, selectedProjectId],
  );
  const featuredProjectCount = useMemo(
    () => projects.filter((item) => item.featured).length,
    [projects],
  );

  useEffect(() => {
    if (selectedProject) {
      setProjectForm(selectedProject);
    } else if (selectedProjectId === "new") {
      setProjectForm(createEmptyProject(projects.length + 1));
    }
  }, [projects, selectedProject, selectedProjectId]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!homePage?.skills?.groups) {
      setProductSkillsText("");
      setTechnicalSkillsText("");
      setToolsText("");
      setProcessStepsText("");
      setHighlightsText("");
      return;
    }

    setProductSkillsText(
      arrayToNewlineList(findSkillGroupItems(homePage.skills.groups, "Product Skills")),
    );
    setTechnicalSkillsText(
      arrayToNewlineList(findSkillGroupItems(homePage.skills.groups, "Technical Skills")),
    );
    setToolsText(
      arrayToNewlineList(findSkillGroupItems(homePage.skills.groups, "Tools")),
    );
    setProcessStepsText(
      objectListToMultiline(homePage.process?.steps || [], [
        "stepNumber",
        "title",
        "description",
      ]),
    );
    setHighlightsText(
      objectListToMultiline(homePage.highlights?.items || [], [
        "emoji",
        "title",
        "description",
      ]),
    );
  }, [homePage]);

  function showNotice(message, type = "success") {
    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    setNotice(message);
    setNoticeType(type);
    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice("");
      noticeTimeoutRef.current = null;
    }, 1000);
  }

  async function refresh(accessKey = adminKey) {
    if (!accessKey) {
      setStatus("locked");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const { siteSettings: settingsData, homePage: homeData, projects: projectData } =
        await contentApi.getAdminBootstrap(accessKey);

      setSiteSettings(settingsData);
      setHomePage(homeData);
      setProjects(projectData);
      setAdminKey(accessKey);
      setKeyInput(accessKey);
      window.localStorage.setItem("portfolioAdminKey", accessKey);
      setStatus("ready");
    } catch (requestError) {
      setAdminKey("");
      window.localStorage.removeItem("portfolioAdminKey");
      setError(requestError.message);
      setStatus("locked");
    }
  }

  async function saveSiteSettings() {
    try {
      setNotice("");
      setError("");
      const updated = await contentApi.updateSiteSettings(siteSettings, adminKey);
      setSiteSettings(updated);
      showNotice("Changes have been saved.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function saveHomePage() {
    try {
      setNotice("");
      setError("");
      const updated = await contentApi.updateHomePage(homePage, adminKey);
      setHomePage(updated);
      showNotice("Changes have been saved.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function saveProject() {
    const isNewProject = !projectForm._id;

    if (isNewProject && getMissingProjectFields(projectForm).length) {
      setError("");
      showNotice("Please fill the mandatory items", "error");
      return;
    }

    try {
      setNotice("");
      setError("");

      if (projectForm._id) {
        await contentApi.updateProject(
          projectForm._id,
          sanitizeProject(projectForm, projects),
          adminKey,
        );
        showNotice("Project updated successfully");
      } else {
        await contentApi.createProject(sanitizeProject(projectForm, projects), adminKey);
        showNotice("Project added successfully");
      }

      await refresh(adminKey);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteSelectedProject() {
    if (!projectForm._id) return;

    try {
      setError("");
      await contentApi.deleteProject(projectForm._id, adminKey);
      setSelectedProjectId("new");
      showNotice("Project deleted successfully");
      await refresh(adminKey);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleProjectDownload() {
    try {
      setError("");
      await downloadProjectsDocx(projects);
      showNotice("Project document downloaded successfully");
    } catch (_error) {
      setError("Unable to create the project document. Please try again.");
    }
  }

  async function unlockAdmin(event) {
    event.preventDefault();
    setNotice("");
    await refresh(keyInput.trim());
  }

  function lockAdmin() {
    setAdminKey("");
    setKeyInput("");
    setSiteSettings(null);
    setHomePage(null);
    setProjects([]);
    setSelectedProjectId("new");
    setProjectForm(createEmptyProject());
    setNotice("");
    setError("");
    setStatus("locked");
    window.localStorage.removeItem("portfolioAdminKey");
  }

  function handleFeaturedToggle(checked) {
    if (checked && !projectForm.featured && featuredProjectCount >= 4) {
      window.alert("You cannot mark more than 4 projects as featured.");
      return;
    }

    setProjectForm({ ...projectForm, featured: checked });
  }

  if (status === "loading") {
    return <div className="admin-shell">Loading admin content...</div>;
  }

  if (status === "locked") {
    return (
      <div className="admin-shell">
        <section className="admin-card">
          <h1>Portfolio Admin Access</h1>
          <p>Enter the portfolio access key to open the site settings and CMS.</p>
          <form className="field-grid" onSubmit={unlockAdmin}>
            <Field
              label="Access Key"
              type="password"
              value={keyInput}
              onChange={setKeyInput}
            />
            <div className="admin-login-actions field-full">
              <button className="button button-primary button-compact" type="submit">
                Login Admin
              </button>
              <a className="button button-secondary button-compact" href="/">
                Go To Home
              </a>
            </div>
          </form>
          {error ? <div className="admin-shell admin-error">{error}</div> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">CMS</p>
          <h1>Portfolio Admin</h1>
          <p>Edit Mongo-backed content that drives the frontend UI.</p>
        </div>
        <div className="admin-actions">
          <a className="button button-secondary" href="/">
            View Site
          </a>
          <button className="button button-secondary" type="button" onClick={lockAdmin}>
            Logout
          </button>
        </div>
      </header>

      {notice ? (
        <div className={`admin-notice admin-toast admin-toast-${noticeType}`} role="status">
          {notice}
        </div>
      ) : null}
      {error ? <div className="admin-shell admin-error">{error}</div> : null}

      <div className="admin-grid">
        <section className="admin-card">
          <h2>Site Settings</h2>
          <div className="field-grid">
            <Field label="Brand Name" value={siteSettings.brand.name} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["brand", "name"], value)} />
            <Field label="Logo Text" value={siteSettings.brand.logoText} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["brand", "logoText"], value)} />
            <Field label="Tagline" value={siteSettings.brand.tagline} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["brand", "tagline"], value)} />
            <Field label="Resume URL" value={siteSettings.resumeUrl} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["resumeUrl"], value)} />
            <Field label="Contact Email" value={siteSettings.contactEmail} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["contactEmail"], value)} />
            <Field label="Footer Text" value={siteSettings.footerText} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["footerText"], value)} />
            <Field label="Primary Color" value={siteSettings.theme.primaryColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "primaryColor"], value)} />
            <Field label="Secondary Color" value={siteSettings.theme.secondaryColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "secondaryColor"], value)} />
            <Field label="Background Color" value={siteSettings.theme.backgroundColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "backgroundColor"], value)} />
            <Field label="Surface Color" value={siteSettings.theme.surfaceColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "surfaceColor"], value)} />
            <Field label="Text Color" value={siteSettings.theme.textColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "textColor"], value)} />
            <Field label="Muted Text Color" value={siteSettings.theme.mutedTextColor} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "mutedTextColor"], value)} />
            <Field label="Gradient From" value={siteSettings.theme.accentGradientFrom} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "accentGradientFrom"], value)} />
            <Field label="Gradient To" value={siteSettings.theme.accentGradientTo} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "accentGradientTo"], value)} />
            <Field label="Display Font" value={siteSettings.theme.fontDisplay} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "fontDisplay"], value)} />
            <Field label="Body Font" value={siteSettings.theme.fontBody} onChange={(value) => updateSiteField(setSiteSettings, siteSettings, ["theme", "fontBody"], value)} />
            <TextAreaField
              label="Navigation (label | href | order)"
              value={objectListToMultiline(siteSettings.navigation, ["label", "href", "displayOrder"])}
              onChange={(value) =>
                setSiteSettings({
                  ...siteSettings,
                  navigation: multilineToObjectList(value, ["label", "href", "displayOrder"]).map((item) => ({
                    ...item,
                    displayOrder: Number(item.displayOrder || 0),
                  })),
                })
              }
            />
            <TextAreaField
              label="Social Links (label | href)"
              value={objectListToMultiline(siteSettings.socialLinks, ["label", "href"])}
              onChange={(value) =>
                setSiteSettings({
                  ...siteSettings,
                  socialLinks: multilineToObjectList(value, ["label", "href"]),
                })
              }
            />
          </div>
          <button className="button button-primary" onClick={saveSiteSettings}>
            Save Site Settings
          </button>
        </section>

        <section className="admin-card">
          <h2>Home Page</h2>
          <div className="field-grid">
            <Field label="Hero Greeting" value={homePage.hero.greeting} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "greeting"], value)} />
            <Field label="Hero Name" value={homePage.hero.name} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "name"], value)} />
            <Field label="Hero Title" value={homePage.hero.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "title"], value)} />
            <Field label="Availability Text" value={homePage.hero.availabilityText} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "availabilityText"], value)} />
            <Field label="Photo URL" value={homePage.hero.photoUrl} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "photoUrl"], value)} />
            <Field label="Video URL" value={homePage.hero.videoUrl} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "videoUrl"], value)} />
            <TextAreaField label="Hero Bio" value={homePage.hero.bio} onChange={(value) => updateSiteField(setHomePage, homePage, ["hero", "bio"], value)} />
            <Field label="Skills Title" value={homePage.skills.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["skills", "title"], value)} />
            <TextAreaField
              label="Product Skills"
              value={productSkillsText}
              onChange={(value) => {
                setProductSkillsText(value);
                setHomePage(updateSkillGroupItems(homePage, "Product Skills", 1, newlineListToArray(value)));
              }}
            />
            <TextAreaField
              label="Technical Skills"
              value={technicalSkillsText}
              onChange={(value) => {
                setTechnicalSkillsText(value);
                setHomePage(updateSkillGroupItems(homePage, "Technical Skills", 2, newlineListToArray(value)));
              }}
            />
            <TextAreaField
              label="Tools"
              value={toolsText}
              onChange={(value) => {
                setToolsText(value);
                setHomePage(updateSkillGroupItems(homePage, "Tools", 3, newlineListToArray(value)));
              }}
            />
            <Field label="Featured Eyebrow" value={homePage.featuredProjects.eyebrow} onChange={(value) => updateSiteField(setHomePage, homePage, ["featuredProjects", "eyebrow"], value)} />
            <Field label="Featured Title" value={homePage.featuredProjects.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["featuredProjects", "title"], value)} />
            <TextAreaField label="Featured Description" value={homePage.featuredProjects.description} onChange={(value) => updateSiteField(setHomePage, homePage, ["featuredProjects", "description"], value)} />
            <Field label="Process Eyebrow" value={homePage.process.eyebrow} onChange={(value) => updateSiteField(setHomePage, homePage, ["process", "eyebrow"], value)} />
            <Field label="Process Title" value={homePage.process.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["process", "title"], value)} />
            <TextAreaField label="Process Description" value={homePage.process.description} onChange={(value) => updateSiteField(setHomePage, homePage, ["process", "description"], value)} />
            <TextAreaField
              label="Process Steps (number | title | description)"
              value={processStepsText}
              onChange={(value) => {
                setProcessStepsText(value);
                updateSiteField(
                  setHomePage,
                  homePage,
                  ["process", "steps"],
                  multilineToObjectList(value, ["stepNumber", "title", "description"]),
                );
              }}
            />
            <Field label="About Eyebrow" value={homePage.highlights.eyebrow} onChange={(value) => updateSiteField(setHomePage, homePage, ["highlights", "eyebrow"], value)} />
            <Field label="About Title" value={homePage.highlights.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["highlights", "title"], value)} />
            <TextAreaField label="About Description" value={homePage.highlights.description} onChange={(value) => updateSiteField(setHomePage, homePage, ["highlights", "description"], value)} />
            <TextAreaField
              label="Highlights (emoji | title | description)"
              value={highlightsText}
              onChange={(value) => {
                setHighlightsText(value);
                updateSiteField(
                  setHomePage,
                  homePage,
                  ["highlights", "items"],
                  multilineToObjectList(value, ["emoji", "title", "description"]),
                );
              }}
            />
            <Field label="Contact Title" value={homePage.contact.title} onChange={(value) => updateSiteField(setHomePage, homePage, ["contact", "title"], value)} />
            <TextAreaField label="Contact Description" value={homePage.contact.description} onChange={(value) => updateSiteField(setHomePage, homePage, ["contact", "description"], value)} />
            <Field label="CTA Label" value={homePage.contact.ctaLabel} onChange={(value) => updateSiteField(setHomePage, homePage, ["contact", "ctaLabel"], value)} />
            <Field label="CTA Email" value={homePage.contact.ctaEmail} onChange={(value) => updateSiteField(setHomePage, homePage, ["contact", "ctaEmail"], value)} />
          </div>
          <button className="button button-primary" onClick={saveHomePage}>
            Save Home Page
          </button>
        </section>
      </div>

      <section className="admin-card">
        <button className="button button-secondary button-compact" type="button" onClick={handleProjectDownload}>
          Download Docx
        </button>
        <div className="admin-project-header">
          <h2>Projects</h2>
          <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)}>
            <option value="new">Create New Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="field-grid">
          <Field required label="Title" value={projectForm.title} onChange={(value) => setProjectForm({ ...projectForm, title: value })} />
          <TextAreaField
            required
            label="Summary"
            value={projectForm.description || projectForm.summary}
            onChange={(value) => setProjectForm({ ...projectForm, summary: value, description: value })}
          />
          <Field label="Category" value={projectForm.category} onChange={(value) => setProjectForm({ ...projectForm, category: value })} />
            <Field label="Display Order" type="number" value={projectForm.displayOrder} onChange={(value) => setProjectForm({ ...projectForm, displayOrder: Number(value || 0) })} />
            <Field label="Emoji" value={projectForm.heroMedia.emoji} onChange={(value) => setProjectForm({ ...projectForm, heroMedia: { ...projectForm.heroMedia, emoji: value } })} />
            <Field label="Gradient From" value={projectForm.heroMedia.gradientFrom} onChange={(value) => setProjectForm({ ...projectForm, heroMedia: { ...projectForm.heroMedia, gradientFrom: value } })} />
            <Field label="Gradient To" value={projectForm.heroMedia.gradientTo} onChange={(value) => setProjectForm({ ...projectForm, heroMedia: { ...projectForm.heroMedia, gradientTo: value } })} />
          <Field label="Image URL" value={projectForm.heroMedia.imageUrl} onChange={(value) => setProjectForm({ ...projectForm, heroMedia: { ...projectForm.heroMedia, imageUrl: value } })} />
          <TextAreaField required label="Problem" value={projectForm.problem} onChange={(value) => setProjectForm({ ...projectForm, problem: value })} />
          <TextAreaField required label="Solution" value={projectForm.solution} onChange={(value) => setProjectForm({ ...projectForm, solution: value })} />
          <TextAreaField label="Tags" value={arrayToNewlineList(projectForm.tags)} onChange={(value) => setProjectForm({ ...projectForm, tags: newlineListToArray(value) })} />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={Boolean(projectForm.featured)}
            onChange={(event) => handleFeaturedToggle(event.target.checked)}
          />
          Featured project
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={Boolean(projectForm.isActive)}
            onChange={(event) =>
              setProjectForm({
                ...projectForm,
                isActive: event.target.checked,
                featured: event.target.checked ? projectForm.featured : false,
              })
            }
          />
          Active project
        </label>

        <section className="admin-subsection">
          <div className="admin-inline-header">
            <h3>Wireframes & Design</h3>
            <button
              className="button button-secondary button-compact"
              type="button"
              onClick={() =>
                setProjectForm({
                  ...projectForm,
                  wireframes: [
                    ...projectForm.wireframes,
                    { name: "", description: "", figmaUrl: "", imageUrl: "" },
                  ],
                })
              }
            >
              Add Wireframe
            </button>
          </div>
          <div className="admin-stack">
            {projectForm.wireframes.map((item, index) => (
              <div className="admin-list-card" key={`wireframe-${index}`}>
                <div className="admin-inline-header">
                  <strong>Wireframe {index + 1}</strong>
                  <button
                    className="button button-secondary button-compact"
                    type="button"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        wireframes: projectForm.wireframes.filter(
                          (_entry, entryIndex) => entryIndex !== index,
                        ),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="field-grid">
                  <Field
                    label="Name"
                    value={item.name}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "wireframes",
                        index,
                        "name",
                        value,
                      )
                    }
                  />
                  <JpegImageField
                    value={item.imageUrl}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "wireframes",
                        index,
                        "imageUrl",
                        value,
                      )
                    }
                  />
                  <Field
                    label="Figma Link"
                    value={item.figmaUrl}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "wireframes",
                        index,
                        "figmaUrl",
                        value,
                      )
                    }
                  />
                  <TextAreaField
                    label="Description"
                    value={item.description}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "wireframes",
                        index,
                        "description",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-subsection">
          <div className="admin-inline-header">
            <h3>Impact Metrics</h3>
            <button
              className="button button-secondary button-compact"
              type="button"
              onClick={() =>
                setProjectForm({
                  ...projectForm,
                  impactMetrics: [...projectForm.impactMetrics, { metric: "", label: "" }],
                })
              }
            >
              Add Impact Metric
            </button>
          </div>
          <div className="admin-stack">
            {projectForm.impactMetrics.map((item, index) => (
              <div className="admin-list-card" key={`impact-${index}`}>
                <div className="admin-inline-header">
                  <strong>Impact Metric {index + 1}</strong>
                  <button
                    className="button button-secondary button-compact"
                    type="button"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        impactMetrics: projectForm.impactMetrics.filter(
                          (_entry, entryIndex) => entryIndex !== index,
                        ),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="field-grid">
                  <Field
                    label="Metric"
                    value={item.metric}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "impactMetrics",
                        index,
                        "metric",
                        value,
                      )
                    }
                  />
                  <Field
                    label="Label"
                    value={item.label}
                    onChange={(value) =>
                      updateProjectListItem(
                        setProjectForm,
                        projectForm,
                        "impactMetrics",
                        index,
                        "label",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="admin-actions">
          <button className="button button-primary" onClick={saveProject}>
            {projectForm._id ? "Update Project" : "Create Project"}
          </button>
          {projectForm._id ? (
            <button className="button button-danger" onClick={deleteSelectedProject}>
              Delete Project
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function updateProjectListItem(setter, state, listKey, index, field, value) {
  setter({
    ...state,
    [listKey]: state[listKey].map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    ),
  });
}

function findSkillGroupItems(groups, title) {
  return groups.find((group) => group.title === title)?.items || [];
}

function updateSkillGroupItems(homePage, title, displayOrder, items) {
  const nextGroups = [...(homePage.skills?.groups || [])];
  const existingIndex = nextGroups.findIndex((group) => group.title === title);
  const nextGroup = {
    title,
    items,
    displayOrder,
  };

  if (existingIndex >= 0) {
    nextGroups[existingIndex] = nextGroup;
  } else {
    nextGroups.push(nextGroup);
  }

  return {
    ...homePage,
    skills: {
      ...homePage.skills,
      groups: nextGroups.sort((left, right) => left.displayOrder - right.displayOrder),
    },
  };
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? <em className="required-marker" aria-label="required"> *</em> : null}
      </span>
      <input
        type={type}
        value={value ?? ""}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false }) {
  return (
    <label className="field field-full">
      <span>
        {label}
        {required ? <em className="required-marker" aria-label="required"> *</em> : null}
      </span>
      <textarea
        rows="4"
        value={value ?? ""}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function JpegImageField({ value, onChange }) {
  const [fileError, setFileError] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      setFileError("Please select a JPEG image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("JPEG image must be 2 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setFileError("");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="field">
      <span>JPEG Image (one per wireframe)</span>
      <input type="file" accept="image/jpeg,.jpg,.jpeg" onChange={handleFileChange} />
      {fileError ? <small className="field-error">{fileError}</small> : null}
      {value ? (
        <div className="wireframe-upload-preview">
          <img src={value} alt="Selected wireframe preview" />
          <button className="text-link" type="button" onClick={() => onChange("")}>Remove image</button>
        </div>
      ) : null}
    </div>
  );
}

function updateSiteField(setter, state, path, value) {
  const next = structuredClone(state);
  let pointer = next;

  path.forEach((segment, index) => {
    if (index === path.length - 1) {
      pointer[segment] = value;
      return;
    }

    pointer = pointer[segment];
  });

  setter(next);
}

function sanitizeProject(project, projects) {
  const summary = project.summary?.trim() || project.description?.trim() || "";

  return {
    slug: project._id ? project.slug : createUniqueProjectSlug(project.title, projects),
    title: project.title,
    summary,
    description: summary,
    category: project.category,
    statusLabel: "",
    tags: project.tags,
    heroMedia: project.heroMedia,
    problem: project.problem,
    solution: project.solution,
    wireframes: project.wireframes.map((item) => ({
      name: item.name?.trim() || "",
      description: item.description?.trim() || "",
      figmaUrl: item.figmaUrl?.trim() || "",
      imageUrl: item.imageUrl || "",
    })),
    impactMetrics: project.impactMetrics.map((item) => ({
      metric: item.metric?.trim() || "",
      label: item.label?.trim() || "",
    })),
    featured: project.isActive ? project.featured : false,
    isActive: project.isActive,
    displayOrder: project.displayOrder,
  };
}

function getMissingProjectFields(project) {
  return [project.title, project.summary || project.description, project.problem, project.solution].filter(
    (value) => !value?.trim(),
  );
}

function createUniqueProjectSlug(title, projects) {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
  const usedSlugs = new Set(projects.map((project) => project.slug));
  let slug = baseSlug;
  let suffix = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
