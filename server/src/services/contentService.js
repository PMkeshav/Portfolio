import {
  validateHomePage,
  validateProject,
  validateSiteSettings,
} from "../../../shared/content.js";
import { connectDb, isDbConnected } from "../config/db.js";
import { HomePage } from "../models/HomePage.js";
import { Project } from "../models/Project.js";
import { SiteSettings } from "../models/SiteSettings.js";
import {
  createFallbackProject,
  deleteFallbackProject,
  getFallbackHomePage,
  getFallbackProjectBySlug,
  getFallbackProjects,
  getFallbackSiteSettings,
  updateFallbackHomePage,
  updateFallbackProject,
  updateFallbackSiteSettings,
} from "./fallbackStore.js";
import { badRequest } from "../utils/http.js";

function normalizeHomePagePayload(homePage) {
  if (!homePage) {
    return homePage;
  }

  if (homePage?.hero?.photoUrl === "/assets/images/myphoto.jpg") {
    return {
      ...homePage,
      hero: {
        ...homePage.hero,
        photoUrl: "/assets/images/myphoto2.jpg",
      },
    };
  }

  return homePage;
}

async function hasDatabaseAccess() {
  if (isDbConnected()) {
    return true;
  }

  return connectDb();
}

function sortProjectsQuery(query) {
  return query.sort({ featured: -1, displayOrder: 1, createdAt: 1 });
}

async function getAdminProjects() {
  if (!(await hasDatabaseAccess())) {
    return getFallbackProjects();
  }

  return sortProjectsQuery(Project.find({})).lean();
}

async function ensureFeaturedLimit(payload, projectId = null) {
  if (!payload?.featured || payload?.isActive === false) {
    return;
  }

  const projects = await getAdminProjects();
  const featuredCount = projects.filter(
    (project) => project.featured && project._id?.toString() !== projectId,
  ).length;

  if (featuredCount >= 4) {
    throw badRequest("Only 4 projects can be featured at a time");
  }
}

export async function getSiteSettings() {
  if (!(await hasDatabaseAccess())) {
    return getFallbackSiteSettings();
  }

  return SiteSettings.findOne({ key: "default" }).lean();
}

export async function updateSiteSettings(payload) {
  const errors = validateSiteSettings(payload);
  if (errors.length) {
    throw badRequest("Invalid site settings payload", errors);
  }

  if (!(await hasDatabaseAccess())) {
    return updateFallbackSiteSettings(payload);
  }

  return SiteSettings.findOneAndUpdate(
    { key: "default" },
    { ...payload, key: "default" },
    { new: true, runValidators: true, upsert: true },
  ).lean();
}

export async function getAdminBootstrap() {
  const [siteSettings, homePage, projects] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getAdminProjects(),
  ]);

  return {
    siteSettings,
    homePage,
    projects,
  };
}

export async function getHomePage() {
  if (!(await hasDatabaseAccess())) {
    return normalizeHomePagePayload(getFallbackHomePage());
  }

  return normalizeHomePagePayload(
    await HomePage.findOne({ key: "home" }).lean(),
  );
}

export async function updateHomePage(payload) {
  const errors = validateHomePage(payload);
  if (errors.length) {
    throw badRequest("Invalid home page payload", errors);
  }

  if (!(await hasDatabaseAccess())) {
    return updateFallbackHomePage(payload);
  }

  return HomePage.findOneAndUpdate(
    { key: "home" },
    { ...payload, key: "home" },
    { new: true, runValidators: true, upsert: true },
  ).lean();
}

export async function getProjects() {
  if (!(await hasDatabaseAccess())) {
    return getFallbackProjects().filter((project) => project.isActive !== false);
  }

  return sortProjectsQuery(Project.find({ isActive: { $ne: false } })).lean();
}

export async function getProjectBySlug(slug) {
  if (!(await hasDatabaseAccess())) {
    const project = getFallbackProjectBySlug(slug);
    return project?.isActive === false ? null : project;
  }

  return Project.findOne({ slug, isActive: { $ne: false } }).lean();
}

export async function createProject(payload) {
  const normalizedPayload = {
    ...payload,
    featured: payload?.isActive === false ? false : payload?.featured,
  };
  const errors = validateProject(normalizedPayload);
  if (errors.length) {
    throw badRequest("Invalid project payload", errors);
  }

  await ensureFeaturedLimit(normalizedPayload);

  if (!(await hasDatabaseAccess())) {
    return createFallbackProject(normalizedPayload);
  }

  const project = await Project.create(normalizedPayload);
  return project.toObject();
}

export async function updateProject(id, payload) {
  const normalizedPayload = {
    ...payload,
    featured: payload?.isActive === false ? false : payload?.featured,
  };
  const errors = validateProject(normalizedPayload);
  if (errors.length) {
    throw badRequest("Invalid project payload", errors);
  }

  await ensureFeaturedLimit(normalizedPayload, id);

  if (!(await hasDatabaseAccess())) {
    const project = updateFallbackProject(id, normalizedPayload);

    if (!project) {
      const error = new Error("Project not found");
      error.status = 404;
      throw error;
    }

    return project;
  }

  const project = await Project.findByIdAndUpdate(id, normalizedPayload, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  return project.toObject();
}

export async function deleteProject(id) {
  if (!(await hasDatabaseAccess())) {
    const project = deleteFallbackProject(id);

    if (!project) {
      const error = new Error("Project not found");
      error.status = 404;
      throw error;
    }

    return project;
  }

  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  return project.toObject();
}
