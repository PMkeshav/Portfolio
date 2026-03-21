export const newlineListToArray = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const arrayToNewlineList = (value = []) => value.join("\n");

export const objectListToMultiline = (value = [], fields = []) =>
  value.map((item) => fields.map((field) => item[field] || "").join(" | ")).join("\n");

export const multilineToObjectList = (value, fields = []) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const segments = line.split("|").map((segment) => segment.trim());
      return fields.reduce((accumulator, field, index) => {
        accumulator[field] = segments[index] || "";
        return accumulator;
      }, {});
    });

export const createEmptyProject = (order = 99) => ({
  slug: "",
  title: "",
  summary: "",
  description: "",
  category: "",
  statusLabel: "Case Study",
  tags: [],
  heroMedia: {
    emoji: "✨",
    imageUrl: "",
    gradientFrom: "#f59e0b",
    gradientTo: "#1a1a2e",
  },
  problem: "",
  solution: "",
  wireframes: [],
  impactMetrics: [],
  featured: false,
  displayOrder: order,
});

