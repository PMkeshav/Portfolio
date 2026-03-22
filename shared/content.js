const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const parsed = new URL(value, "http://localhost");
    return Boolean(parsed);
  } catch {
    return false;
  }
};

const requireString = (errors, value, path, label) => {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label} is required at ${path}`);
  }
};

const requireArray = (errors, value, path, label) => {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array at ${path}`);
    return false;
  }

  return true;
};

export function validateSiteSettings(payload) {
  const errors = [];

  requireString(errors, payload?.brand?.name, "brand.name", "Brand name");
  requireString(
    errors,
    payload?.brand?.logoText,
    "brand.logoText",
    "Brand logo text",
  );
  requireString(
    errors,
    payload?.contactEmail,
    "contactEmail",
    "Contact email",
  );

  if (!requireArray(errors, payload?.navigation, "navigation", "Navigation")) {
    return errors;
  }

  payload.navigation.forEach((item, index) => {
    requireString(errors, item?.label, `navigation[${index}].label`, "Nav label");
    requireString(errors, item?.href, `navigation[${index}].href`, "Nav href");
  });

  if (!requireArray(errors, payload?.socialLinks, "socialLinks", "Social links")) {
    return errors;
  }

  payload.socialLinks.forEach((item, index) => {
    requireString(errors, item?.label, `socialLinks[${index}].label`, "Social label");
    if (!isValidUrl(item?.href)) {
      errors.push(`Social link URL is invalid at socialLinks[${index}].href`);
    }
  });

  if (!isValidUrl(payload?.resumeUrl)) {
    errors.push("Resume URL must be valid");
  }

  return errors;
}

export function validateHomePage(payload) {
  const errors = [];

  requireString(errors, payload?.hero?.name, "hero.name", "Hero name");
  requireString(errors, payload?.hero?.title, "hero.title", "Hero title");
  requireString(errors, payload?.hero?.bio, "hero.bio", "Hero bio");

  if (!requireArray(errors, payload?.skills?.groups, "skills.groups", "Skill groups")) {
    return errors;
  }

  payload.skills.groups.forEach((group, index) => {
    requireString(errors, group?.title, `skills.groups[${index}].title`, "Skill group title");
    if (!requireArray(errors, group?.items, `skills.groups[${index}].items`, "Skill items")) {
      return;
    }

    group.items.forEach((item, itemIndex) => {
      requireString(
        errors,
        item,
        `skills.groups[${index}].items[${itemIndex}]`,
        "Skill item",
      );
    });
  });

  if (!requireArray(errors, payload?.process?.steps, "process.steps", "Process steps")) {
    return errors;
  }

  payload.process.steps.forEach((step, index) => {
    requireString(errors, step?.title, `process.steps[${index}].title`, "Process title");
    requireString(
      errors,
      step?.description,
      `process.steps[${index}].description`,
      "Process description",
    );
  });

  if (
    !requireArray(
      errors,
      payload?.highlights?.items,
      "highlights.items",
      "Highlight items",
    )
  ) {
    return errors;
  }

  payload.highlights.items.forEach((item, index) => {
    requireString(errors, item?.title, `highlights.items[${index}].title`, "Highlight title");
    requireString(
      errors,
      item?.description,
      `highlights.items[${index}].description`,
      "Highlight description",
    );
  });

  return errors;
}

export function validateProject(payload) {
  const errors = [];

  requireString(errors, payload?.slug, "slug", "Project slug");
  requireString(errors, payload?.title, "title", "Project title");
  requireString(errors, payload?.summary, "summary", "Project summary");
  requireString(errors, payload?.description, "description", "Project description");
  requireString(errors, payload?.problem, "problem", "Project problem");
  requireString(errors, payload?.solution, "solution", "Project solution");

  if (!requireArray(errors, payload?.tags, "tags", "Project tags")) {
    return errors;
  }

  if (!requireArray(errors, payload?.wireframes, "wireframes", "Wireframes")) {
    return errors;
  }

  payload.wireframes.forEach((item, index) => {
    requireString(errors, item?.name, `wireframes[${index}].name`, "Wireframe name");
    requireString(
      errors,
      item?.description,
      `wireframes[${index}].description`,
      "Wireframe description",
    );
    if (!isValidUrl(item?.figmaUrl)) {
      errors.push(`Wireframe Figma URL is invalid at wireframes[${index}].figmaUrl`);
    }
  });

  if (
    !requireArray(errors, payload?.impactMetrics, "impactMetrics", "Impact metrics")
  ) {
    return errors;
  }

  payload.impactMetrics.forEach((item, index) => {
    requireString(
      errors,
      item?.metric,
      `impactMetrics[${index}].metric`,
      "Impact metric value",
    );
    requireString(
      errors,
      item?.label,
      `impactMetrics[${index}].label`,
      "Impact metric label",
    );
  });

  return errors;
}
