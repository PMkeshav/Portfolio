const COLORS = {
  accent: "B45309",
  heading: "1F2937",
  muted: "6B7280",
};

const hasValue = (value) => typeof value === "string" && value.trim().length > 0;

function labelValue(docx, label, value) {
  if (!hasValue(value)) return null;
  const { Paragraph, TextRun } = docx;

  return new Paragraph({
    spacing: { after: 90 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: COLORS.heading }),
      new TextRun({ text: value.trim(), color: COLORS.heading }),
    ],
  });
}

function sectionHeading(docx, title) {
  const { HeadingLevel, Paragraph } = docx;
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
  });
}

function projectChildren(docx, project, index) {
  const { HeadingLevel, Paragraph, TextRun } = docx;
  const children = [
    new Paragraph({
      text: project.title?.trim() || `Project ${index + 1}`,
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: index > 0,
      spacing: { after: 120 },
    }),
  ];

  const projectMeta = [
    ["Category", project.category],
    ["Display order", Number.isFinite(project.displayOrder) ? String(project.displayOrder) : ""],
    ["Slug", project.slug],
  ];
  projectMeta.forEach(([label, value]) => {
    const paragraph = labelValue(docx, label, value);
    if (paragraph) children.push(paragraph);
  });

  const summary = project.summary || project.description;
  if (hasValue(summary)) {
    children.push(sectionHeading(docx, "Summary"));
    children.push(new Paragraph({ text: summary.trim(), spacing: { after: 90 } }));
  }

  if (hasValue(project.description) && project.description.trim() !== summary?.trim()) {
    children.push(sectionHeading(docx, "Description"));
    children.push(new Paragraph({ text: project.description.trim(), spacing: { after: 90 } }));
  }

  const tags = (project.tags || []).filter(hasValue);
  if (tags.length) {
    const paragraph = labelValue(docx, "Tags", tags.join(", "));
    if (paragraph) children.push(paragraph);
  }

  if (hasValue(project.problem)) {
    children.push(sectionHeading(docx, "Problem"));
    children.push(new Paragraph({ text: project.problem.trim(), spacing: { after: 90 } }));
  }

  if (hasValue(project.solution)) {
    children.push(sectionHeading(docx, "Solution"));
    children.push(new Paragraph({ text: project.solution.trim(), spacing: { after: 90 } }));
  }

  const visualDetails = [
    ["Emoji", project.heroMedia?.emoji],
    ["Image URL", project.heroMedia?.imageUrl],
    ["Gradient from", project.heroMedia?.gradientFrom],
    ["Gradient to", project.heroMedia?.gradientTo],
  ];
  const hasVisualDetails = visualDetails.some(([, value]) => hasValue(value));
  if (hasVisualDetails) {
    children.push(sectionHeading(docx, "Visual details"));
    visualDetails.forEach(([label, value]) => {
      const paragraph = labelValue(docx, label, value);
      if (paragraph) children.push(paragraph);
    });
  }

  const wireframes = (project.wireframes || []).filter((item) =>
    [item.name, item.description, item.figmaUrl].some(hasValue),
  );
  if (wireframes.length) {
    children.push(sectionHeading(docx, "Wireframes & Design"));
    wireframes.forEach((wireframe, wireframeIndex) => {
      children.push(
        new Paragraph({
          text: wireframe.name?.trim() || `Wireframe ${wireframeIndex + 1}`,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 60 },
        }),
      );
      [
        ["Description", wireframe.description],
        ["Figma link", wireframe.figmaUrl],
      ].forEach(([label, value]) => {
        const paragraph = labelValue(docx, label, value);
        if (paragraph) children.push(paragraph);
      });
    });
  }

  const impactMetrics = (project.impactMetrics || []).filter((item) =>
    [item.metric, item.label].some(hasValue),
  );
  if (impactMetrics.length) {
    children.push(sectionHeading(docx, "Impact & Results"));
    impactMetrics.forEach((item) => {
      const text = [item.metric, item.label].filter(hasValue).map((value) => value.trim()).join(" — ");
      children.push(new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 70 } }));
    });
  }

  return children;
}

export async function downloadProjectsDocx(projects) {
  const docx = await import("docx");
  const { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } = docx;
  const sortedProjects = [...projects].sort(
    (left, right) => Number(left.displayOrder || 0) - Number(right.displayOrder || 0),
  );
  const document = new Document({
    creator: "Keshav Kumar Portfolio",
    title: "Portfolio Projects",
    description: "Portfolio project export",
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children: [
          new Paragraph({
            text: "Portfolio Projects",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 90 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [
              new TextRun({
                text: `Generated ${new Date().toLocaleDateString()}`,
                color: COLORS.muted,
                italics: true,
              }),
            ],
          }),
          ...sortedProjects.flatMap((project, index) => projectChildren(docx, project, index)),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");

  anchor.href = url;
  anchor.download = "portfolio-projects.docx";
  anchor.click();
  URL.revokeObjectURL(url);
}
