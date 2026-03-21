import {
  createProject,
  deleteProject,
  getHomePage,
  getProjectBySlug,
  getProjects,
  getSiteSettings,
  updateHomePage,
  updateProject,
  updateSiteSettings,
} from "../services/contentService.js";
import { asyncHandler } from "../utils/http.js";

export const fetchSiteSettings = asyncHandler(async (_req, res) => {
  const data = await getSiteSettings();
  res.json(data);
});

export const putSiteSettings = asyncHandler(async (req, res) => {
  const data = await updateSiteSettings(req.body);
  res.json(data);
});

export const fetchHomePage = asyncHandler(async (_req, res) => {
  const data = await getHomePage();
  res.json(data);
});

export const putHomePage = asyncHandler(async (req, res) => {
  const data = await updateHomePage(req.body);
  res.json(data);
});

export const fetchProjects = asyncHandler(async (_req, res) => {
  const data = await getProjects();
  res.json(data);
});

export const fetchProjectBySlug = asyncHandler(async (req, res) => {
  const data = await getProjectBySlug(req.params.slug);

  if (!data) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json(data);
});

export const postProject = asyncHandler(async (req, res) => {
  const data = await createProject(req.body);
  res.status(201).json(data);
});

export const putProject = asyncHandler(async (req, res) => {
  const data = await updateProject(req.params.id, req.body);
  res.json(data);
});

export const removeProject = asyncHandler(async (req, res) => {
  const data = await deleteProject(req.params.id);
  res.json(data);
});

