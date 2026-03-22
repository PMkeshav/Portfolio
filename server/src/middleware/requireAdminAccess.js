import { env } from "../config/env.js";
import { forbidden } from "../utils/http.js";

export async function requireAdminAccess(req, _res, next) {
  try {
    const providedKey = req.get("x-portfolio-key")?.trim();

    if (!providedKey) {
      next(forbidden("Admin access key is required"));
      return;
    }

    if (providedKey !== env.adminAccessKey) {
      next(forbidden("Invalid admin access key"));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
