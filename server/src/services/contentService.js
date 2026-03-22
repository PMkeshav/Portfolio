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

async function hasDatabaseAccess() {
  if (isDbConnected()) {
    return true;
  }

  return connectDb();
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
    getProjects(),
  ]);

  return {
    siteSettings,
    homePage,
    projects,
  };
}

export async function getHomePage() {
  if (!(await hasDatabaseAccess())) {
    return getFallbackHomePage();
  }

  return HomePage.findOne({ key: "home" }).lean();
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
    return getFallbackProjects();
  }

  return Project.find({}).sort({ displayOrder: 1, createdAt: 1 }).lean();
}

export async function getProjectBySlug(slug) {
  if (!(await hasDatabaseAccess())) {
    return getFallbackProjectBySlug(slug);
  }

  return Project.findOne({ slug }).lean();
}

export async function createProject(payload) {
  const errors = validateProject(payload);
  if (errors.length) {
    throw badRequest("Invalid project payload", errors);
  }

  if (!(await hasDatabaseAccess())) {
    return createFallbackProject(payload);
  }

  const project = await Project.create(payload);
  return project.toObject();
}

export async function updateProject(id, payload) {
  const errors = validateProject(payload);
  if (errors.length) {
    throw badRequest("Invalid project payload", errors);
  }

  if (!(await hasDatabaseAccess())) {
    const project = updateFallbackProject(id, payload);

    if (!project) {
      const error = new Error("Project not found");
      error.status = 404;
      throw error;
    }

    return project;
  }

  const project = await Project.findByIdAndUpdate(id, payload, {
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
