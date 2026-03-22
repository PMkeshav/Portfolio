import mongoose from "mongoose";

const navigationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const socialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    brand: {
      name: { type: String, required: true },
      logoText: { type: String, required: true },
      tagline: { type: String, default: "" },
    },
    navigation: [navigationSchema],
    theme: {
      primaryColor: { type: String, required: true },
      secondaryColor: { type: String, required: true },
      backgroundColor: { type: String, required: true },
      surfaceColor: { type: String, required: true },
      textColor: { type: String, required: true },
      mutedTextColor: { type: String, required: true },
      accentGradientFrom: { type: String, required: true },
      accentGradientTo: { type: String, required: true },
      fontDisplay: { type: String, required: true },
      fontBody: { type: String, required: true },
    },
    resumeUrl: { type: String, default: "" },
    contactEmail: { type: String, required: true },
    socialLinks: [socialLinkSchema],
    footerText: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
