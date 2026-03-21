import mongoose from "mongoose";

const wireframeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const impactMetricSchema = new mongoose.Schema(
  {
    metric: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "" },
    statusLabel: { type: String, default: "" },
    tags: [{ type: String, required: true }],
    heroMedia: {
      emoji: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      gradientFrom: { type: String, required: true },
      gradientTo: { type: String, required: true },
    },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    wireframes: [wireframeSchema],
    impactMetrics: [impactMetricSchema],
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);

