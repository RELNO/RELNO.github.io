#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "projects");
const templatePath = path.join(rootDir, "templates", "project-page.html");
const footerPath = path.join(rootDir, "footer", "footer.html");
const projectListPath = path.join(projectsDir, "projects.json");
const projectSourceFile = "index.md";
const siteUrl = "https://www.arielnoyman.com";

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseYamlScalar(rawValue) {
  const value = String(rawValue ?? "").trim();

  if (value === "") {
    return "";
  }

  if (value === "[]") {
    return [];
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null") {
    return null;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }

  return value;
}

function parseFrontMatterYaml(yaml, filePath) {
  const data = {};
  let currentArrayKey = "";
  let currentArrayItem = null;

  yaml.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim() || line.trim().startsWith("#")) {
      return;
    }

    const topLevel = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (topLevel) {
      const [, key, rawValue = ""] = topLevel;
      const value = parseYamlScalar(rawValue);
      data[key] = rawValue === "" ? [] : value;
      currentArrayKey = rawValue === "" ? key : "";
      currentArrayItem = null;
      return;
    }

    const arrayItem = line.match(/^  -(?:\s+(.*))?$/);
    if (arrayItem && currentArrayKey) {
      const rawItem = arrayItem[1] || "";
      const pair = rawItem.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

      if (pair) {
        const [, key, rawValue = ""] = pair;
        currentArrayItem = {
          [key]: parseYamlScalar(rawValue),
        };
        data[currentArrayKey].push(currentArrayItem);
        return;
      }

      currentArrayItem = null;
      data[currentArrayKey].push(parseYamlScalar(rawItem));
      return;
    }

    const nestedProperty = line.match(/^    ([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (nestedProperty && currentArrayItem) {
      const [, key, rawValue = ""] = nestedProperty;
      currentArrayItem[key] = parseYamlScalar(rawValue);
      return;
    }

    throw new Error(
      `Unsupported front matter syntax in ${filePath}:${index + 1}: ${line}`
    );
  });

  return data;
}

function readProjectMarkdown(filePath) {
  const source = readFile(filePath);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${filePath} must start with YAML front matter.`);
  }

  const [, yaml, body] = match;
  return {
    ...parseFrontMatterYaml(yaml, filePath),
    text: body.trim(),
  };
}

function readProjectSources() {
  const projects = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const slug = entry.name;
      const sourcePath = path.join(projectsDir, slug, projectSourceFile);

      if (!fs.existsSync(sourcePath)) {
        return null;
      }

      const project = readProjectMarkdown(sourcePath);
      return {
        ...project,
        slug,
        sourcePath,
        listImageSrc: project.imageSrc || "",
        themes: Array.isArray(project.themes) ? project.themes : [],
        order: Number.isFinite(Number(project.order))
          ? Number(project.order)
          : Number.MAX_SAFE_INTEGER,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return a.slug.localeCompare(b.slug);
    });

  if (projects.length === 0) {
    throw new Error(`No project Markdown files found under ${projectsDir}.`);
  }

  return projects;
}

function writeProjectList(projects) {
  const projectList = projects.map((project) => {
    return {
      name: project.slug,
      title: project.listTitle || project.title || project.slug,
      imageSrc: project.imageSrc || "",
      themes: project.themes,
    };
  });
  const json = [
    "[",
    projectList
      .map((project) => {
        const themes = project.themes.map((theme) => JSON.stringify(theme));

        return [
          "  {",
          `    "name": ${JSON.stringify(project.name)},`,
          `    "title": ${JSON.stringify(project.title)},`,
          `    "imageSrc": ${JSON.stringify(project.imageSrc)},`,
          `    "themes": [${themes.join(", ")}]`,
          "  }",
        ].join("\n");
      })
      .join(",\n"),
    "]",
    "",
  ].join("\n");

  fs.writeFileSync(projectListPath, json);
  console.log(`Generated ${path.relative(rootDir, projectListPath)}`);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/\s+/g, " ").trim();
}

function normalizeAssetPath(value) {
  const source = String(value ?? "").trim();

  if (!source) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|data:|#|\/)/i.test(source)) {
    return source;
  }

  return `/${source.replace(/^\.?\//, "")}`;
}

function normalizeExternalUrl(value) {
  return String(value ?? "").replace(/&amp;/g, "&").trim();
}

function getYouTubeId(value) {
  const source = normalizeExternalUrl(value);
  const match = source.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/)|youtube\.com\/watch\?[^#]*v=|youtu\.be\/|i\.ytimg\.com\/vi\/)([A-Za-z0-9_-]+)/
  );

  return match ? match[1] : "";
}

function getYouTubeWatchUrl(value) {
  const videoId = getYouTubeId(value);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
}

function getYouTubeEmbedUrl(value) {
  const videoId = getYouTubeId(value);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
}

function mediaAutoplays(item) {
  return item.autoplay !== false;
}

function getYouTubeEmbedAttributes(embedUrl, videoId, item) {
  if (!mediaAutoplays(item)) {
    return embedUrl;
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
  });

  if (item.loop === true && videoId) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `${embedUrl}?${params.toString()}`;
}

function getYouTubeThumbnailUrl(value) {
  const videoId = getYouTubeId(value);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
}

function stripHtml(value) {
  return String(value ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, maxLength - 1).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, Math.max(lastSpace, 0)).trimEnd()}...`;
}

function renderInlineText(value) {
  return String(value ?? "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
    })
    .replace(/`([^`]+)`/g, (_match, label) => {
      return `<span class="project-inline-title">${escapeHtml(label)}</span>`;
    })
    .replace(/\*\*([^*\n]+)\*\*/g, (_match, label) => {
      return `<strong>${escapeHtml(label)}</strong>`;
    })
    .replace(/(^|[^*])\*([^*\n]+)\*/g, (_match, prefix, label) => {
      return `${prefix}<em>${escapeHtml(label)}</em>`;
    });
}

function isBlockHtml(value) {
  return /^<(?:blockquote|div|figure|h[2-4]|ol|ul)\b[\s\S]*<\/(?:blockquote|div|figure|h[2-4]|ol|ul)>$/i.test(
    value.trim()
  );
}

function renderMarkdownList(block, isOrdered) {
  const tagName = isOrdered ? "ol" : "ul";
  const itemPattern = isOrdered ? /^\d+\.\s+/ : /^[-*]\s+/;
  const items = block
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(itemPattern, ""))
    .map((line) => `  <li>${renderInlineText(line)}</li>`)
    .join("\n");

  return `<${tagName}>\n${items}\n</${tagName}>`;
}

function renderMarkdownBlock(block) {
  const content = block.trim();
  const lines = content.split(/\n/);
  const heading = content.match(/^(#{2,4})\s+(.+)$/);

  if (isBlockHtml(content)) {
    return renderInlineText(content);
  }

  if (heading && lines.length === 1) {
    const level = heading[1].length;
    return `<h${level}>${renderInlineText(heading[2].trim())}</h${level}>`;
  }

  if (lines.every((line) => /^>\s?/.test(line.trim()))) {
    const quote = lines
      .map((line) => line.trim().replace(/^>\s?/, ""))
      .join("\n");
    return `<blockquote>\n${renderMarkdownBlocks(quote)}\n</blockquote>`;
  }

  if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
    return renderMarkdownList(content, false);
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
    return renderMarkdownList(content, true);
  }

  return `<p>${renderInlineText(content).replace(/\n/g, "<br />\n")}</p>`;
}

function renderMarkdownBlocks(markdown) {
  const trimmed = String(markdown ?? "").trim();

  if (!trimmed) {
    return "";
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => {
      return renderMarkdownBlock(paragraph);
    })
    .join("\n");
}

function renderProjectDescription(text) {
  const content = renderMarkdownBlocks(text);

  if (!content) {
    return "";
  }

  return `<section class="project-description">\n${content}\n</section>`;
}

function renderProjectInfo(projectMeta, projectBadges, projectDescription) {
  const projectFacts = [projectMeta, projectBadges].filter(Boolean).join("\n");

  if (!projectFacts) {
    return `<div class="project-info project-info-no-facts">\n${projectDescription}\n</div>`;
  }

  return [
    '<div class="project-info">',
    '  <aside class="project-facts" aria-label="Project details">',
    projectFacts,
    "  </aside>",
    "",
    projectDescription,
    "</div>",
  ].join("\n");
}

function renderProjectMeta(project) {
  const rows = [];

  if (Array.isArray(project.credits)) {
    project.credits
      .filter((credit) => {
        if (!credit || !credit.label || !credit.value) {
          return false;
        }

        return String(credit.label).trim().toLowerCase() !== "role";
      })
      .forEach((credit) => {
        rows.push({
          label: credit.label,
          value: credit.value,
        });
      });
  }

  if (rows.length === 0) {
    return "";
  }

  const factRows = rows
    .map((row) => {
      return [
        '  <div class="project-fact-row">',
        `    <dt>${escapeHtml(row.label)}</dt>`,
        `    <dd>${escapeHtml(row.value).replace(/\n/g, "<br />\n")}</dd>`,
        "  </div>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<dl class="project-meta">',
    factRows,
    "</dl>",
  ].join("\n");
}

function renderBadges(project) {
  if (!Array.isArray(project.badges) || project.badges.length === 0) {
    return "";
  }

  const links = project.badges
    .filter((badge) => badge && badge.label && badge.link)
    .map((badge) => {
      const href = normalizeAssetPath(badge.link);
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener">${escapeHtml(badge.label)}</a>`;
    })
    .join("\n");

  if (!links) {
    return "";
  }

  return [
    '<div class="project-links project-fact-row" aria-label="Project links">',
    "  <strong>Links</strong>",
    `  <div>${links}</div>`,
    "</div>",
  ].join("\n");
}

function renderMediaItem(item, project, index, options = {}) {
  if (!item || !item.src) {
    return "";
  }

  const title = project.title || "Project";
  const source = normalizeAssetPath(item.src);
  const className = options.className || "project-gallery-item";

  if (item.type === "video") {
    const caption = item.caption
      ? `  <figcaption>${escapeHtml(item.caption)}</figcaption>`
      : "";
    const hasAutoplay = mediaAutoplays(item);
    const videoAttributes = [
      item.controls === false ? "" : "controls",
      hasAutoplay ? "autoplay" : "",
      hasAutoplay || item.muted === true ? "muted" : "",
      item.loop === true ? "loop" : "",
      "playsinline",
      `preload="${escapeAttribute(item.preload || (hasAutoplay ? "auto" : "metadata"))}"`,
    ]
      .filter(Boolean)
      .join(" ");

    return [
      `<figure class="${className} project-video">`,
      `  <video ${videoAttributes}>`,
      `    <source src="${escapeAttribute(source)}" type="${escapeAttribute(item.mime || "video/mp4")}" />`,
      "  </video>",
      caption,
      "</figure>",
    ].filter(Boolean).join("\n");
  }

  if (item.type === "iframe" || item.type === "link") {
    const originalSource = normalizeExternalUrl(item.src);
    const mediaUrl = normalizeExternalUrl(item.link || originalSource);
    const youtubeId = getYouTubeId(mediaUrl) || getYouTubeId(originalSource);
    const youtubeSource = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "";
    const youtubeEmbed = getYouTubeEmbedUrl(youtubeSource);
    const href = normalizeAssetPath(item.link || getYouTubeWatchUrl(originalSource) || originalSource);
    const label =
      item.caption ||
      item.title ||
      (youtubeId ? `Watch ${title}` : `Open ${title}`);

    if (youtubeEmbed) {
      const hasAutoplay = mediaAutoplays(item);
      const embedUrl = getYouTubeEmbedAttributes(youtubeEmbed, youtubeId, item);
      const caption = label
        ? `\n  <figcaption><a href="${escapeAttribute(youtubeSource)}" target="_blank" rel="noopener">${escapeHtml(label)}</a></figcaption>`
        : "";

      return [
        `<figure class="${className} project-embed project-youtube">`,
        `  <iframe src="${escapeAttribute(embedUrl)}" title="${escapeAttribute(label)}" loading="${options.eager || hasAutoplay ? "eager" : "lazy"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>${caption}`,
        "</figure>",
      ].join("\n");
    }

    const inferredThumbnail =
      item.type === "link" ? item.src : getYouTubeThumbnailUrl(originalSource);
    const thumbnail = normalizeAssetPath(
      item.thumbnail || item.image || inferredThumbnail || project.listImageSrc || item.src
    );

    return [
      `<figure class="${className} project-linked-media">`,
      `  <a class="project-media-link" href="${escapeAttribute(href)}" target="_blank" rel="noopener">`,
      `    <img src="${escapeAttribute(thumbnail)}" alt="${escapeAttribute(label)}" loading="${options.eager ? "eager" : "lazy"}" />`,
      `    <figcaption>${escapeHtml(label)}</figcaption>`,
      "  </a>",
      "</figure>",
    ].join("\n");
  }

  const alt = item.alt || item.caption || `${title} image ${index + 1}`;
  const caption = item.caption
    ? `\n  <figcaption>${escapeHtml(item.caption)}</figcaption>`
    : "";

  return [
    `<figure class="${className}">`,
    `  <img src="${escapeAttribute(source)}" alt="${escapeAttribute(alt)}" loading="${options.eager ? "eager" : "lazy"}" />${caption}`,
    "</figure>",
  ].join("\n");
}

function renderLeadMedia(project) {
  const items = Array.isArray(project.carouselItems) ? project.carouselItems : [];

  if (items.length === 0) {
    return "";
  }

  const lead = renderMediaItem(items[0], project, 0, {
    className: "project-lead-media",
    eager: true,
  });

  if (!lead) {
    return "";
  }

  return `<section class="project-lead" aria-label="Featured project media">\n${lead}\n</section>`;
}

function renderGallery(project) {
  const items = Array.isArray(project.carouselItems) ? project.carouselItems.slice(1) : [];

  if (items.length === 0) {
    return "";
  }

  const title = project.title || "Project";
  const galleryItems = items
    .map((item, index) => {
      return renderMediaItem(item, project, index + 1);
    })
    .filter(Boolean)
    .join("\n");

  return `<section class="project-gallery" aria-label="${escapeAttribute(title)} media gallery">\n${galleryItems}\n</section>`;
}

function renderTemplate(template, replacements) {
  return Object.entries(replacements).reduce((html, [key, value]) => {
    return html.replaceAll(`{{${key}}}`, value);
  }, template);
}

function generateProjectPages() {
  const projects = readProjectSources();
  const template = readFile(templatePath);
  const siteFooter = readFile(footerPath).trim();

  writeProjectList(projects);

  projects.forEach((project) => {
    const slug = project.slug;
    const title = project.title || project.listTitle || slug;
    const isWriting = project.themes.includes("writing");
    const plainDescription = stripHtml(project.text || project.subtitle || title);
    const metaDescription = truncate(plainDescription || `${title} by Ariel Noyman`, 160);
    const canonicalUrl = `${siteUrl}/projects/${slug}/`;
    const projectMeta = renderProjectMeta(project);
    const projectBadges = renderBadges(project);
    const projectDescription = renderProjectDescription(project.text);
    const html = renderTemplate(template, {
      siteFooter,
      pageTitle: `${escapeHtml(title)} | Ariel Noyman`,
      bodyClass: isWriting ? "project-page writing-project-page" : "project-page",
      articleClass: isWriting ? "project-article writing-project" : "project-article",
      metaDescription: escapeAttribute(metaDescription),
      canonicalUrl: escapeAttribute(canonicalUrl),
      projectTitle: escapeHtml(title),
      projectSubtitleBlock: project.subtitle
        ? `<p class="project-heading-meta">${escapeHtml(project.subtitle)}</p>`
        : "",
      projectLeadMedia: renderLeadMedia(project),
      projectInfo: renderProjectInfo(projectMeta, projectBadges, projectDescription),
      projectGallery: renderGallery(project),
    }).replace(
      "<!DOCTYPE html>",
      "<!DOCTYPE html>\n<!-- Generated by tools/generate-project-pages.js. Do not edit by hand. -->"
    );

    const outputPath = path.join(projectsDir, slug, "index.html");
    fs.writeFileSync(outputPath, `${html}\n`);
    console.log(`Generated ${path.relative(rootDir, outputPath)}`);
  });
}

generateProjectPages();
