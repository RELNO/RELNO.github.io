(() => {
  "use strict";

  const repoTreeUrl =
    "https://api.github.com/repos/RELNO/RELNO.github.io/git/trees/master?recursive=1";
  const cacheKey = "arielnoyman:writings:paths:v1";
  const writingPathPattern = /^writings\/[^/]+\/index\.md$/;

  const archive = document.getElementById("writingArchive");
  const body = document.getElementById("writingBody");
  const title = document.getElementById("writingTitle");
  const subtitle = document.getElementById("writingSubtitle");
  const date = document.getElementById("writingDate");
  const cover = document.getElementById("writingCover");
  const coverImage = document.getElementById("writingCoverImage");
  const coverCaption = document.getElementById("writingCoverCaption");
  const footer = document.getElementById("footer");

  let writings = [];

  const currentSlug = () => decodeURIComponent(window.location.hash.slice(1));

  const isLocalPreview = () =>
    ["", "localhost", "127.0.0.1", "::1"].includes(
      window.location.hostname || ""
    );

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const stripQuotes = (value) =>
    String(value || "")
      .trim()
      .replace(/^["']|["']$/g, "");

  const normalizeHeading = (value) =>
    String(value || "")
      .replace(/[`*_#]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  function parseFrontMatter(source) {
    const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    const metadata = {};

    if (!match) {
      return { metadata, body: source };
    }

    match[1].split("\n").forEach((line) => {
      const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (item) {
        metadata[item[1]] = stripQuotes(item[2]);
      }
    });

    return {
      metadata,
      body: source.slice(match[0].length)
    };
  }

  function slugFromPath(path) {
    const parts = path.split("/");
    return parts[parts.length - 2] || path;
  }

  function formatDate(value) {
    const parsed = value ? new Date(`${value}T00:00:00`) : null;

    if (!parsed || Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function cachedPaths() {
    try {
      const paths = JSON.parse(window.localStorage.getItem(cacheKey) || "[]");
      return Array.isArray(paths) ? paths : [];
    } catch (error) {
      return [];
    }
  }

  function cachePaths(paths) {
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(paths));
    } catch (error) {
    }
  }

  async function discoverPaths() {
    try {
      const response = await fetch(repoTreeUrl);
      if (!response.ok) {
        throw new Error("Could not discover writings.");
      }

      const payload = await response.json();
      const paths = (payload.tree || [])
        .map((node) => node.path || "")
        .filter((path) => writingPathPattern.test(path))
        .map((path) => `/${path}`);
      const localSlug = isLocalPreview() && currentSlug();

      if (
        localSlug &&
        !paths.some((path) => slugFromPath(path) === localSlug)
      ) {
        paths.push(`/writings/${localSlug}/index.md`);
      }

      if (paths.length) {
        cachePaths(paths);
        return paths;
      }
    } catch (error) {
      const paths = cachedPaths();
      if (paths.length) {
        return paths;
      }
    }

    if (currentSlug()) {
      return [`/writings/${currentSlug()}/index.md`];
    }

    throw new Error("No Markdown writings found.");
  }

  async function loadWriting(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Could not load ${path}`);
    }

    const parsed = parseFrontMatter(await response.text());

    return {
      path,
      slug: parsed.metadata.slug || slugFromPath(path),
      metadata: parsed.metadata,
      body: parsed.body
    };
  }

  function removeLeadHeading(markdown, marker, expected) {
    const lines = markdown.split("\n");
    let index = 0;

    while (index < lines.length && lines[index].trim() === "") {
      index += 1;
    }

    const text = lines[index] || "";
    if (
      text.startsWith(`${marker} `) &&
      normalizeHeading(text.slice(marker.length + 1)) ===
        normalizeHeading(expected)
    ) {
      lines.splice(index, 1);
    }

    return lines.join("\n").replace(/^\s+/, "");
  }

  function articleBody(item) {
    let markdown = item.body;

    if (item.metadata.title) {
      markdown = removeLeadHeading(markdown, "#", item.metadata.title);
    }

    if (item.metadata.subtitle) {
      markdown = removeLeadHeading(markdown, "##", item.metadata.subtitle);
    }

    return markdown;
  }

  function markdownToHtml(markdown) {
    const html =
      window.marked && typeof window.marked.parse === "function"
        ? window.marked.parse(markdown, { breaks: false, gfm: true })
        : `<pre>${escapeHtml(markdown)}</pre>`;

    if (!window.DOMPurify) {
      return html;
    }

    return window.DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "height",
        "loading",
        "referrerpolicy",
        "rel",
        "scrolling",
        "src",
        "target",
        "title",
        "width"
      ]
    });
  }

  function renderCover(metadata) {
    if (!metadata.image) {
      cover.hidden = true;
      coverImage.removeAttribute("src");
      coverImage.alt = "";
      coverCaption.textContent = "";
      return;
    }

    coverImage.src = metadata.image;
    coverImage.alt = metadata.imageAlt || "";
    coverCaption.textContent = metadata.imageCaption || "";
    coverCaption.hidden = !metadata.imageCaption;
    cover.hidden = false;
  }

  function renderArchive(activeSlug) {
    archive.innerHTML = writings
      .map((item) => {
        const itemDate = formatDate(item.metadata.date);
        const current = item.slug === activeSlug ? "page" : "false";

        return `<a class="writings-archive-link" href="/writings/#${encodeURIComponent(
          item.slug
        )}" data-writing-slug="${escapeHtml(
          item.slug
        )}" aria-current="${current}"><span class="writings-archive-title">${escapeHtml(
          item.metadata.title || item.slug
        )}</span>${
          itemDate
            ? `<span class="writings-archive-date">${escapeHtml(itemDate)}</span>`
            : ""
        }</a>`;
      })
      .join("");
  }

  function enhanceBody() {
    body.querySelectorAll("a[href]").forEach((link) => {
      if (/^https?:\/\//i.test(link.href)) {
        link.target = "_blank";
        link.rel = "noopener";
      }
    });

    body.querySelectorAll("img").forEach((image) => {
      image.loading = "lazy";
    });
  }

  function renderWriting(slug = currentSlug()) {
    const item = writings.find((candidate) => candidate.slug === slug) || writings[0];

    if (!item) {
      title.textContent = "No writings found";
      body.innerHTML =
        '<p class="writing-loading">Add Markdown files under <code>writings/&lt;slug&gt;/index.md</code> to publish them here.</p>';
      return;
    }

    const metadata = item.metadata;
    const itemDate = formatDate(metadata.date);

    title.textContent = metadata.title || item.slug;
    subtitle.textContent = metadata.subtitle || "";
    subtitle.hidden = !metadata.subtitle;
    date.textContent = itemDate;
    date.hidden = !itemDate;
    body.innerHTML = markdownToHtml(articleBody(item));
    document.title = `${metadata.title || "Writings"} | Ariel Noyman`;

    if (metadata.description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", metadata.description);
    }

    renderCover(metadata);
    renderArchive(item.slug);
    enhanceBody();
  }

  async function loadFooter() {
    if (!footer) {
      return;
    }

    try {
      const response = await fetch("/footer/footer.html");
      footer.innerHTML = await response.text();
    } catch (error) {
      footer.innerHTML = "";
    }
  }

  async function init() {
    try {
      const paths = await discoverPaths();
      const loaded = (
        await Promise.all(
          paths.map((path) =>
            loadWriting(path).catch((error) => {
              console.warn(error);
              return null;
            })
          )
        )
      ).filter(Boolean);

      writings = loaded
        .filter(
          (item) =>
            String(item.metadata.status || "published").toLowerCase() !== "draft"
        )
        .sort((a, b) =>
          String(b.metadata.date || "").localeCompare(a.metadata.date || "")
        );

      renderWriting();
    } catch (error) {
      console.error(error);
      title.textContent = "Writings could not be loaded";
      body.innerHTML =
        '<p class="writing-loading">Please try refreshing the page.</p>';
      archive.innerHTML = "";
    }

    loadFooter();
  }

  window.addEventListener("hashchange", () => renderWriting());

  archive.addEventListener("click", (event) => {
    const link = event.target.closest("[data-writing-slug]");
    if (!link) {
      return;
    }

    event.preventDefault();
    const slug = link.getAttribute("data-writing-slug");

    if (currentSlug() === slug) {
      renderWriting(slug);
    } else {
      window.location.hash = encodeURIComponent(slug);
    }
  });

  init();
})();
