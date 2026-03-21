import { Router } from "express";
import {
  fetchHomePage,
  fetchProjectBySlug,
  fetchProjects,
  fetchSiteSettings,
  postProject,
  putHomePage,
  putProject,
  putSiteSettings,
  removeProject,
} from "../controllers/contentController.js";

const router = Router();

router.get("/site-settings", fetchSiteSettings);
router.get("/pages/home", fetchHomePage);
router.get("/projects", fetchProjects);
router.get("/projects/:slug", fetchProjectBySlug);

router.put("/admin/site-settings", putSiteSettings);
router.put("/admin/pages/home", putHomePage);
router.post("/admin/projects", postProject);
router.put("/admin/projects/:id", putProject);
router.delete("/admin/projects/:id", removeProject);

export default router;

