import { Router } from "express";
import {
  fetchAdminBootstrap,
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
import { requireAdminAccess } from "../middleware/requireAdminAccess.js";

const router = Router();

router.get("/site-settings", fetchSiteSettings);
router.get("/pages/home", fetchHomePage);
router.get("/projects", fetchProjects);
router.get("/projects/:slug", fetchProjectBySlug);

router.get("/admin/bootstrap", requireAdminAccess, fetchAdminBootstrap);
router.use("/admin", requireAdminAccess);
router.put("/admin/site-settings", putSiteSettings);
router.put("/admin/pages/home", putHomePage);
router.post("/admin/projects", postProject);
router.put("/admin/projects/:id", putProject);
router.delete("/admin/projects/:id", removeProject);

export default router;
