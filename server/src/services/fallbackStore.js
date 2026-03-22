import {
  seedHomePage,
  seedProjects,
  seedSiteSettings,
} from "../data/seedData.js";

let siteSettings = structuredClone(seedSiteSettings);
let homePage = structuredClone(seedHomePage);
let projects = seedProjects.map((project, index) => ({
  ...structuredClone(project),
  _id: `seed-project-${index + 1}`,
}));

export function getFallbackSiteSettings() {
  return structuredClone(siteSettings);
}

export function updateFallbackSiteSettings(payload) {
  siteSettings = {
    ...structuredClone(payload),
    key: "default",
  };
  return getFallbackSiteSettings();
}

export function getFallbackHomePage() {
  return structuredClone(homePage);
}

export function updateFallbackHomePage(payload) {
  homePage = { ...structuredClone(payload), key: "home" };
  return getFallbackHomePage();
}

export function getFallbackProjects() {
  return [...projects]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((project) => structuredClone(project));
}

export function getFallbackProjectBySlug(slug) {
  const project = projects.find((item) => item.slug === slug);
  return project ? structuredClone(project) : null;
}

export function createFallbackProject(payload) {
  const project = {
    ...structuredClone(payload),
    _id: `seed-project-${Date.now()}`,
  };
  projects.push(project);
  return structuredClone(project);
}

export function updateFallbackProject(id, payload) {
  const index = projects.findIndex((item) => item._id === id);
  if (index === -1) return null;

  projects[index] = {
    ...structuredClone(payload),
    _id: id,
  };

  return structuredClone(projects[index]);
}

export function deleteFallbackProject(id) {
  const existing = projects.find((item) => item._id === id);
  if (!existing) return null;

  projects = projects.filter((item) => item._id !== id);
  return structuredClone(existing);
}
