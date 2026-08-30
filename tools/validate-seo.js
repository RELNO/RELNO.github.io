#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "projects");
const siteUrl = "https://www.arielnoyman.com";
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attributes(tag) {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([:\w-]+)="([^"]*)"/g), ([, key, value]) => [
      key,
      decodeHtml(value),
    ])
  );
}

function findTag(html, tagName, attributeName, attributeValue) {
  const tags = Array.from(
    html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi")),
    (match) => match[0]
  );

  return tags.find((tag) => {
    const attrs = attributes(tag);
    return attrs[attributeName] === attributeValue;
  });
}

function metaContent(html, attributeName, attributeValue) {
  const tag = findTag(html, "meta", attributeName, attributeValue);
  return tag ? attributes(tag).content || "" : "";
}

function linkHref(html, rel) {
  const tag = findTag(html, "link", "rel", rel);
  return tag ? attributes(tag).href || "" : "";
}

function titleText(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1].trim()) : "";
}

function jsonLdBlocks(html) {
  return Array.from(
    html.matchAll(
      /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi
    ),
    (match) => match[1]
  );
}

function report(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

const projectPages = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) =>
    fs.existsSync(path.join(projectsDir, entry.name, "index.md"))
  )
  .map((entry) => `projects/${entry.name}/index.html`)
  .sort();
const pages = ["index.html", ...projectPages];
const canonicalUrls = new Map();
const pageTitles = new Map();

pages.forEach((relativePath) => {
  const html = read(relativePath);
  const pageLabel = relativePath;
  const expectedCanonical =
    relativePath === "index.html"
      ? `${siteUrl}/`
      : `${siteUrl}/${path.dirname(relativePath)}/`;
  const title = titleText(html);
  const description = metaContent(html, "name", "description");
  const robots = metaContent(html, "name", "robots");
  const canonical = linkHref(html, "canonical");
  const ogTitle = metaContent(html, "property", "og:title");
  const ogDescription = metaContent(html, "property", "og:description");
  const ogUrl = metaContent(html, "property", "og:url");
  const ogImage = metaContent(html, "property", "og:image");
  const ogImageAlt = metaContent(html, "property", "og:image:alt");
  const ogImageWidth = metaContent(html, "property", "og:image:width");
  const ogImageHeight = metaContent(html, "property", "og:image:height");
  const twitterCard = metaContent(html, "name", "twitter:card");
  const twitterSite = metaContent(html, "name", "twitter:site");
  const twitterTitle = metaContent(html, "name", "twitter:title");
  const twitterDescription = metaContent(html, "name", "twitter:description");
  const twitterImage = metaContent(html, "name", "twitter:image");
  const structuredData = jsonLdBlocks(html);

  report(title.length > 0, `${pageLabel}: missing title`);
  report(title.length <= 65, `${pageLabel}: title exceeds 65 characters`);
  report(
    description.length > 0 && description.length <= 200,
    `${pageLabel}: description must contain 1–200 characters`
  );
  report(
    robots.includes("index") && robots.includes("max-image-preview:large"),
    `${pageLabel}: incomplete crawler directives`
  );
  report(canonical === expectedCanonical, `${pageLabel}: incorrect canonical URL`);
  report(ogTitle === title, `${pageLabel}: Open Graph title differs from title`);
  report(
    ogDescription === description,
    `${pageLabel}: Open Graph description differs from meta description`
  );
  report(ogUrl === canonical, `${pageLabel}: Open Graph URL differs from canonical`);
  report(Boolean(ogImage), `${pageLabel}: missing Open Graph image`);
  report(Boolean(ogImageAlt), `${pageLabel}: missing Open Graph image alt text`);
  report(Number(ogImageWidth) > 0, `${pageLabel}: missing Open Graph image width`);
  report(Number(ogImageHeight) > 0, `${pageLabel}: missing Open Graph image height`);
  report(Boolean(twitterCard), `${pageLabel}: missing X card type`);
  report(twitterSite === "@relnox", `${pageLabel}: missing X site identity`);
  report(twitterTitle === title, `${pageLabel}: X title differs from title`);
  report(
    twitterDescription === description,
    `${pageLabel}: X description differs from meta description`
  );
  report(twitterImage === ogImage, `${pageLabel}: social images do not match`);
  report(structuredData.length === 1, `${pageLabel}: expected one JSON-LD block`);

  structuredData.forEach((block) => {
    try {
      const data = JSON.parse(block);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
      report(
        data["@context"] === "https://schema.org",
        `${pageLabel}: incorrect structured-data context`
      );
      report(
        graph.some((entity) => entity["@id"] === `${siteUrl}/#person`),
        `${pageLabel}: structured data does not identify Ariel Noyman`
      );
    } catch (error) {
      errors.push(`${pageLabel}: invalid JSON-LD (${error.message})`);
    }
  });

  if (ogImage.startsWith(`${siteUrl}/`)) {
    const imagePath = path.join(rootDir, new URL(ogImage).pathname);
    report(fs.existsSync(imagePath), `${pageLabel}: social image is missing locally`);
  }

  if (canonicalUrls.has(canonical)) {
    errors.push(
      `${pageLabel}: duplicate canonical also used by ${canonicalUrls.get(canonical)}`
    );
  }
  canonicalUrls.set(canonical, pageLabel);

  if (pageTitles.has(title)) {
    errors.push(`${pageLabel}: duplicate title also used by ${pageTitles.get(title)}`);
  }
  pageTitles.set(title, pageLabel);
});

const sitemap = read("sitemap.xml");
const sitemapUrls = new Set(
  Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
    decodeHtml(match[1])
  )
);
report(
  sitemapUrls.size === pages.length,
  `sitemap.xml: expected ${pages.length} canonical URLs, found ${sitemapUrls.size}`
);
canonicalUrls.forEach((_page, canonical) => {
  report(sitemapUrls.has(canonical), `sitemap.xml: missing ${canonical}`);
});

const robotsTxt = read("robots.txt");
report(robotsTxt.includes("User-agent: *"), "robots.txt: missing global user agent");
report(robotsTxt.includes("Allow: /"), "robots.txt: site is not explicitly crawlable");
report(
  robotsTxt.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  "robots.txt: missing sitemap declaration"
);

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `SEO validation passed for ${pages.length} pages and ${sitemapUrls.size} sitemap URLs.`
);
