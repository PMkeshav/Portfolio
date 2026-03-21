import mongoose from "mongoose";

const heroCtaSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    variant: { type: String, enum: ["primary", "secondary"], default: "primary" },
  },
  { _id: false },
);

const skillGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    items: [{ type: String, required: true }],
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const highlightSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const homePageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "home" },
    hero: {
      greeting: { type: String, required: true },
      availabilityText: { type: String, required: true },
      name: { type: String, required: true },
      title: { type: String, required: true },
      bio: { type: String, required: true },
      photoUrl: { type: String, required: true },
      videoUrl: { type: String, default: "" },
      primaryCta: heroCtaSchema,
      secondaryCta: heroCtaSchema,
    },
    skills: {
      title: { type: String, required: true },
      groups: [skillGroupSchema],
    },
    featuredProjects: {
      eyebrow: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      projectSlugs: [{ type: String, required: true }],
    },
    process: {
      eyebrow: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      steps: [processStepSchema],
    },
    highlights: {
      eyebrow: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      items: [highlightSchema],
    },
    contact: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      ctaLabel: { type: String, required: true },
      ctaEmail: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const HomePage = mongoose.model("HomePage", homePageSchema);

