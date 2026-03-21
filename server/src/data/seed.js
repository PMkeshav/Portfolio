import { connectDb } from "../config/db.js";
import { HomePage } from "../models/HomePage.js";
import { Project } from "../models/Project.js";
import { SiteSettings } from "../models/SiteSettings.js";
import {
  seedHomePage,
  seedProjects,
  seedSiteSettings,
} from "./seedData.js";

async function seed() {
  await connectDb();

  await Promise.all([
    SiteSettings.findOneAndUpdate({ key: "default" }, seedSiteSettings, {
      upsert: true,
      new: true,
    }),
    HomePage.findOneAndUpdate({ key: "home" }, seedHomePage, {
      upsert: true,
      new: true,
    }),
  ]);

  await Project.deleteMany({});
  await Project.insertMany(seedProjects);

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

