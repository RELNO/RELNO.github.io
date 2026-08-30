#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "projects");
const templatePath = path.join(rootDir, "templates", "project-page.html");
const footerPath = path.join(rootDir, "footer", "footer.html");
const projectListPath = path.join(projectsDir, "projects.json");
const sitemapPath = path.join(rootDir, "sitemap.xml");
const thumbnailManifestPath = path.join(
  rootDir,
  "img",
  "project-thumbnails",
  "manifest.json"
);
const projectSourceFile = "index.md";
const siteUrl = "https://www.arielnoyman.com";
const siteName = "Ariel Noyman";
const websiteId = `${siteUrl}/#website`;
const personId = `${siteUrl}/#person`;
const aboutUrl = `${siteUrl}/projects/00about/`;
const portraitUrl = `${siteUrl}/sections/an.png`;
const defaultSeoTitle =
  "Ariel Noyman | Urban Scientist, Architect & Designer";
const defaultMetaDescription =
  "Ariel Noyman, PhD, is a Research Scientist at MIT, a faculty member at Cornell and CUNY, and an architect and urban designer working to democratize data-driven design and decision-making.";
const personSameAs = [
  "https://www.media.mit.edu/people/noyman/overview/",
  "https://scholar.google.com/citations?user=2QzGsBYAAAAJ&hl=en",
  "https://www.linkedin.com/in/arielnoyman",
  "https://github.com/RELNO",
  "https://twitter.com/relnox",
  "https://www.youtube.com/user/arielnoyman",
];
const homepageImageSizes =
  "(max-width: 760px) 50vw, (min-width: 1500px) 16.667vw, 200px";

function absoluteSiteUrl(value) {
  const source = String(value ?? "").trim();

  if (!source) {
    return siteUrl;
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  return new URL(source.replace(/^\.?\//, "/"), `${siteUrl}/`).href;
}

function imageMimeType(value) {
  const pathname = new URL(absoluteSiteUrl(value)).pathname.toLowerCase();

  if (pathname.endsWith(".png")) {
    return "image/png";
  }

  if (pathname.endsWith(".webp")) {
    return "image/webp";
  }

  if (pathname.endsWith(".avif")) {
    return "image/avif";
  }

  return "image/jpeg";
}

function localSiteAssetPath(value) {
  const assetUrl = new URL(absoluteSiteUrl(value));

  if (assetUrl.origin !== new URL(siteUrl).origin) {
    return "";
  }

  const assetPath = path.resolve(
    rootDir,
    decodeURIComponent(assetUrl.pathname).replace(/^\/+/, "")
  );
  const relativePath = path.relative(rootDir, assetPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return "";
  }

  return assetPath.startsWith(`${rootDir}${path.sep}`) && fs.existsSync(assetPath)
    ? assetPath
    : "";
}

function imageDimensions(value) {
  const assetPath = localSiteAssetPath(value);

  if (!assetPath) {
    return null;
  }

  const image = fs.readFileSync(assetPath);
  const mimeType = imageMimeType(value);

  if (mimeType === "image/png" && image.length >= 24) {
    return {
      width: image.readUInt32BE(16),
      height: image.readUInt32BE(20),
    };
  }

  if (mimeType !== "image/jpeg" || image.length < 4) {
    return null;
  }

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;

  while (offset + 8 < image.length) {
    if (image[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = image[offset + 1];
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }

    if (offset + 2 > image.length) {
      break;
    }

    const segmentLength = image.readUInt16BE(offset);

    if (startOfFrameMarkers.has(marker) && offset + 7 <= image.length) {
      return {
        width: image.readUInt16BE(offset + 5),
        height: image.readUInt16BE(offset + 3),
      };
    }

    if (segmentLength < 2) {
      break;
    }

    offset += segmentLength;
  }

  return null;
}

function personEntity(includeProfileDetails = false) {
  const person = {
    "@type": "Person",
    "@id": personId,
    name: siteName,
    givenName: "Ariel",
    familyName: "Noyman",
    honorificSuffix: "PhD",
    url: aboutUrl,
    image: portraitUrl,
    sameAs: personSameAs,
  };

  if (!includeProfileDetails) {
    return person;
  }

  return {
    ...person,
    description: defaultMetaDescription,
    jobTitle: [
      "Research Scientist",
      "Urban Scientist",
      "Architect",
      "Urban Designer",
    ],
    worksFor: {
      "@type": "Organization",
      name: "MIT City Science Center",
      url: "https://www.media.mit.edu/groups/city-science/overview/",
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Massachusetts Institute of Technology",
        url: "https://www.mit.edu/",
      },
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Massachusetts Institute of Technology",
        url: "https://www.mit.edu/",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Bezalel Academy of Arts and Design",
        url: "https://www.bezalel.ac.il/en",
      },
    ],
    knowsAbout: [
      "Urban science",
      "Architecture",
      "Urban design",
      "Urban modeling",
      "Real-time simulation",
      "Participatory design",
      "Human-computer interaction",
      "CityScope",
      "Street Knowledge",
      "Data-driven urban planning",
    ],
    award: [
      "European Union UrbanAct Award",
      "First place, Rebuild by Design",
      "First prize, Museum of Tolerance design competition",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "75 Amherst Street",
      addressLocality: "Cambridge",
      addressRegion: "MA",
      postalCode: "02139",
      addressCountry: "US",
    },
  };
}

function websiteEntity() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteUrl}/`,
    name: siteName,
    description: defaultMetaDescription,
    inLanguage: "en-US",
    publisher: { "@id": personId },
  };
}

function safeJsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

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

function isRemoteAsset(value) {
  return /^https?:\/\//i.test(String(value ?? "").trim());
}

function fileSha256(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

function readThumbnailManifest() {
  if (!fs.existsSync(thumbnailManifestPath)) {
    throw new Error(
      "Homepage thumbnail manifest is missing. Run `python3 tools/generate-project-thumbnails.py`."
    );
  }

  const manifest = JSON.parse(readFile(thumbnailManifestPath));
  if (manifest.version !== 1 || !manifest.projects) {
    throw new Error(`Unsupported thumbnail manifest: ${thumbnailManifestPath}`);
  }

  return manifest;
}

function getHomepageImage(project, thumbnailManifest) {
  if (isRemoteAsset(project.imageSrc)) {
    return {
      src: project.imageSrc,
      srcSet: "",
      sizes: "",
      width: 400,
      height: 400,
    };
  }

  const entry = thumbnailManifest.projects[project.slug];
  const regenerateMessage =
    "Run `python3 tools/generate-project-thumbnails.py` before regenerating project pages.";

  if (!entry || entry.source !== project.imageSrc) {
    throw new Error(
      `Missing homepage thumbnails for ${project.slug}. ${regenerateMessage}`
    );
  }

  const sourcePath = path.resolve(rootDir, project.imageSrc.replace(/^\//, ""));
  if (
    !fs.existsSync(sourcePath) ||
    fileSha256(sourcePath) !== entry.sourceSha256
  ) {
    throw new Error(
      `Stale homepage thumbnails for ${project.slug}. ${regenerateMessage}`
    );
  }

  const variants = entry.variants
    .filter((variant) => variant && variant.src && Number.isFinite(variant.width))
    .sort((a, b) => a.width - b.width);

  if (variants.length === 0) {
    throw new Error(
      `Missing homepage thumbnail variants for ${project.slug}. ${regenerateMessage}`
    );
  }

  variants.forEach((variant) => {
    const variantPath = path.resolve(rootDir, variant.src.replace(/^\//, ""));
    if (!fs.existsSync(variantPath)) {
      throw new Error(`Missing thumbnail file ${variant.src}. ${regenerateMessage}`);
    }
  });

  return {
    src: variants[0].src,
    srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    sizes: homepageImageSizes,
    width: variants[0].width,
    height: variants[0].height,
  };
}

function writeProjectList(projects, thumbnailManifest) {
  const projectList = projects.map((project) => {
    const homepageImage = getHomepageImage(project, thumbnailManifest);
    return {
      name: project.slug,
      title: project.listTitle || project.title || project.slug,
      imageSrc: project.imageSrc || "",
      thumbnailSrc: homepageImage.src,
      thumbnailSrcSet: homepageImage.srcSet,
      thumbnailSizes: homepageImage.sizes,
      thumbnailWidth: homepageImage.width,
      thumbnailHeight: homepageImage.height,
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
          `    "thumbnailSrc": ${JSON.stringify(project.thumbnailSrc)},`,
          `    "thumbnailSrcSet": ${JSON.stringify(project.thumbnailSrcSet)},`,
          `    "thumbnailSizes": ${JSON.stringify(project.thumbnailSizes)},`,
          `    "thumbnailWidth": ${JSON.stringify(project.thumbnailWidth)},`,
          `    "thumbnailHeight": ${JSON.stringify(project.thumbnailHeight)},`,
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

function escapeXml(value) {
  return String(value ?? "").replace(/[<>&"']/g, (char) => {
    return {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    }[char];
  });
}

function writeSitemap(projects) {
  const urls = [
    { loc: `${siteUrl}/` },
    ...projects.map((project) => ({
      loc: `${siteUrl}/projects/${project.slug}/`,
      lastmod: /^\d{4}-\d{2}-\d{2}$/.test(String(project.dateModified || ""))
        ? project.dateModified
        : "",
    })),
  ];
  const entries = urls
    .map(({ loc, lastmod }) => {
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(sitemapPath, xml);
  console.log(`Generated ${path.relative(rootDir, sitemapPath)}`);
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

function getProjectMetaDescription(project, title) {
  if (project.metaDescription) {
    return truncate(stripHtml(project.metaDescription), 200);
  }

  const plainDescription = stripHtml(project.text || project.subtitle || title);
  return truncate(plainDescription || `${title} by ${siteName}`, 160);
}

function getProjectSocialImage(project) {
  return absoluteSiteUrl(project.imageSrc || portraitUrl);
}

function getProjectSocialImageAlt(project, title) {
  const firstItem = Array.isArray(project.carouselItems)
    ? project.carouselItems[0]
    : null;

  return (
    firstItem?.alt ||
    firstItem?.caption ||
    project.listTitle ||
    `${title} by ${siteName}`
  );
}

function projectKeywords(project) {
  const themeLabels = {
    architecture: "Architecture",
    urbanism: "Urbanism",
    "city-science": "Urban science",
    writing: "Writing",
    publication: "Publication",
    talk: "Talk",
    award: "Award",
  };

  return Array.from(
    new Set(
      ["Ariel Noyman", ...(project.themes || []).map((theme) => themeLabels[theme] || theme)]
    )
  );
}

function buildProjectStructuredData(
  project,
  {
    title,
    pageTitle,
    canonicalUrl,
    metaDescription,
    socialImage,
    socialImageAlt,
    socialImageDimensions,
  }
) {
  const isAbout = project.slug === "00about";
  const webpageId = `${canonicalUrl}#webpage`;
  const imageId = `${canonicalUrl}#primaryimage`;
  const image = {
    "@type": "ImageObject",
    "@id": imageId,
    url: socialImage,
    contentUrl: socialImage,
    caption: socialImageAlt,
    ...(socialImageDimensions || {}),
  };

  if (isAbout) {
    const profilePage = {
      "@type": "ProfilePage",
      "@id": webpageId,
      url: canonicalUrl,
      name: pageTitle,
      description: metaDescription,
      inLanguage: "en-US",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
      primaryImageOfPage: { "@id": imageId },
    };

    if (project.dateModified) {
      profilePage.dateModified = project.dateModified;
    }

    return safeJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        websiteEntity(),
        personEntity(true),
        image,
        profilePage,
      ],
    });
  }

  const creativeWorkId = `${canonicalUrl}#creativework`;
  const webPage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: canonicalUrl,
    name: pageTitle,
    description: metaDescription,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": creativeWorkId },
    primaryImageOfPage: { "@id": imageId },
  };
  const creativeWork = {
    "@type": "CreativeWork",
    "@id": creativeWorkId,
    url: canonicalUrl,
    name: title,
    description: metaDescription,
    image: { "@id": imageId },
    creator: { "@id": personId },
    keywords: projectKeywords(project),
    inLanguage: "en-US",
  };

  if (project.dateModified) {
    webPage.dateModified = project.dateModified;
    creativeWork.dateModified = project.dateModified;
  }

  return safeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      websiteEntity(),
      personEntity(false),
      image,
      creativeWork,
      webPage,
    ],
  });
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
      item.poster
        ? `poster="${escapeAttribute(normalizeAssetPath(item.poster))}"`
        : "",
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
  const thumbnailManifest = readThumbnailManifest();
  const template = readFile(templatePath);
  const siteFooter = readFile(footerPath).trim();

  writeProjectList(projects, thumbnailManifest);
  writeSitemap(projects);

  projects.forEach((project) => {
    const slug = project.slug;
    const title = project.title || project.listTitle || slug;
    const isAbout = slug === "00about";
    const isWriting = project.themes.includes("writing");
    const pageTitle =
      project.seoTitle ||
      (isAbout ? defaultSeoTitle : `${title} | ${siteName}`);
    const socialTitle = project.socialTitle || pageTitle;
    const metaDescription = getProjectMetaDescription(project, title);
    const canonicalUrl = `${siteUrl}/projects/${slug}/`;
    const socialImage = getProjectSocialImage(project);
    const socialImageAlt = getProjectSocialImageAlt(project, title);
    const socialImageDimensions = imageDimensions(socialImage);
    const structuredData = buildProjectStructuredData(project, {
      title,
      pageTitle,
      canonicalUrl,
      metaDescription,
      socialImage,
      socialImageAlt,
      socialImageDimensions,
    });
    const projectMeta = renderProjectMeta(project);
    const projectBadges = renderBadges(project);
    const projectDescription = renderProjectDescription(project.text);
    const html = renderTemplate(template, {
      siteFooter,
      pageTitle: escapeHtml(pageTitle),
      bodyClass: isWriting ? "project-page writing-project-page" : "project-page",
      articleClass: isWriting ? "project-article writing-project" : "project-article",
      metaDescription: escapeAttribute(metaDescription),
      canonicalUrl: escapeAttribute(canonicalUrl),
      openGraphType: isAbout ? "profile" : isWriting ? "article" : "website",
      socialTitle: escapeAttribute(socialTitle),
      socialImage: escapeAttribute(socialImage),
      socialImageType: imageMimeType(socialImage),
      socialImageAlt: escapeAttribute(socialImageAlt),
      socialImageDimensions: socialImageDimensions
        ? [
            `<meta property="og:image:width" content="${socialImageDimensions.width}" />`,
            `<meta property="og:image:height" content="${socialImageDimensions.height}" />`,
          ].join("\n    ")
        : "",
      twitterCard: isAbout ? "summary" : "summary_large_image",
      profileMeta: isAbout
        ? [
            '<meta property="profile:first_name" content="Ariel" />',
            '<meta property="profile:last_name" content="Noyman" />',
            '<meta property="profile:username" content="relnox" />',
          ].join("\n    ")
        : "",
      structuredData,
      projectHero:
        project.hideTitle === true
          ? ""
          : [
              '<header class="project-hero">',
              `  <h1>${escapeHtml(title)}</h1>`,
              project.subtitle
                ? `  <p class="project-heading-meta">${escapeHtml(project.subtitle)}</p>`
                : "",
              "</header>",
            ]
              .filter(Boolean)
              .join("\n"),
      projectLeadMedia: renderLeadMedia(project),
      projectInfo: renderProjectInfo(projectMeta, projectBadges, projectDescription),
      projectGallery: renderGallery(project),
    })
      .replace(
        "<!DOCTYPE html>",
        "<!DOCTYPE html>\n<!-- Generated by tools/generate-project-pages.js. Do not edit by hand. -->"
      )
      .replace(/[ \t]+$/gm, "")
      .trimEnd();

    const outputPath = path.join(projectsDir, slug, "index.html");
    fs.writeFileSync(outputPath, `${html}\n`);
    console.log(`Generated ${path.relative(rootDir, outputPath)}`);
  });
}

generateProjectPages();
