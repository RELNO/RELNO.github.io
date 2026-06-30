(function () {
  "use strict";

  var manifestUrl = "/writings/writings.json?v=20260630-2";
  var archiveElement = document.getElementById("writingArchive");
  var bodyElement = document.getElementById("writingBody");
  var titleElement = document.getElementById("writingTitle");
  var subtitleElement = document.getElementById("writingSubtitle");
  var dateElement = document.getElementById("writingDate");
  var coverElement = document.getElementById("writingCover");
  var coverImageElement = document.getElementById("writingCoverImage");
  var coverCaptionElement = document.getElementById("writingCoverCaption");
  var footerElement = document.getElementById("footer");
  var writings = [];

  function stripQuotes(value) {
    return String(value || "")
      .trim()
      .replace(/^["']|["']$/g, "");
  }

  function parseFrontMatter(source) {
    var metadata = {};
    var body = source;
    var match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);

    if (match) {
      match[1].split("\n").forEach(function (line) {
        var item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (item) {
          metadata[item[1]] = stripQuotes(item[2]);
        }
      });
      body = source.slice(match[0].length);
    }

    return {
      metadata: metadata,
      body: body
    };
  }

  function slugFromFile(file) {
    return file
      .replace(/\/(?:index|article)\.(?:md|json)$/i, "")
      .replace(/\.(?:md|json)$/i, "")
      .split("/")
      .pop();
  }

  function normalizeHeading(value) {
    return String(value || "")
      .replace(/[`*_#]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function removeLeadHeading(markdown, marker, expected) {
    var lines = markdown.split("\n");
    var index = 0;

    while (index < lines.length && lines[index].trim() === "") {
      index += 1;
    }

    if (
      index < lines.length &&
      lines[index].indexOf(marker + " ") === 0 &&
      normalizeHeading(lines[index].slice(marker.length + 1)) ===
        normalizeHeading(expected)
    ) {
      lines.splice(index, 1);
    }

    return lines.join("\n").replace(/^\s+/, "");
  }

  function stripLeadTitle(markdown, metadata) {
    var body = markdown;

    if (metadata.title) {
      body = removeLeadHeading(body, "#", metadata.title);
    }

    if (metadata.subtitle) {
      body = removeLeadHeading(body, "##", metadata.subtitle);
    }

    return body;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fallbackMarkdown(markdown) {
    var lines = markdown.split(/\n{2,}/);

    return lines
      .map(function (block) {
        var text = block.trim();
        var heading = text.match(/^(#{1,4})\s+(.+)$/);

        if (!text) {
          return "";
        }

        if (heading) {
          return (
            "<h" +
            heading[1].length +
            ">" +
            escapeHtml(heading[2]) +
            "</h" +
            heading[1].length +
            ">"
          );
        }

        return "<p>" + escapeHtml(text).replace(/\n/g, "<br />") + "</p>";
      })
      .join("\n");
  }

  function markdownToHtml(markdown) {
    var html;

    if (window.marked && typeof window.marked.parse === "function") {
      html = window.marked.parse(markdown, {
        breaks: false,
        gfm: true
      });
    } else {
      html = fallbackMarkdown(markdown);
    }

    if (window.DOMPurify) {
      return window.DOMPurify.sanitize(html, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: [
          "allow",
          "allowfullscreen",
          "frameborder",
          "height",
          "loading",
          "referrerpolicy",
          "scrolling",
          "src",
          "target",
          "title",
          "width",
          "rel"
        ]
      });
    }

    return html;
  }

  function formatDate(value) {
    var date = value ? new Date(value + "T00:00:00") : null;

    if (!date || Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function sortByDateDescending(a, b) {
    return String(b.metadata.date || "").localeCompare(
      String(a.metadata.date || "")
    );
  }

  function currentSlug() {
    return decodeURIComponent(window.location.hash.replace(/^#/, ""));
  }

  function setCurrentSlug(slug) {
    if (currentSlug() !== slug) {
      window.location.hash = encodeURIComponent(slug);
    }
  }

  function enhanceRenderedBody() {
    Array.prototype.slice
      .call(bodyElement.querySelectorAll("a[href]"))
      .forEach(function (link) {
        if (/^https?:\/\//i.test(link.href)) {
          link.target = "_blank";
          link.rel = "noopener";
        }
      });

    Array.prototype.slice
      .call(bodyElement.querySelectorAll("img"))
      .forEach(function (image) {
        image.loading = "lazy";
      });
  }

  function renderCover(metadata) {
    if (!metadata.image) {
      coverElement.hidden = true;
      coverImageElement.removeAttribute("src");
      coverImageElement.alt = "";
      coverCaptionElement.textContent = "";
      return;
    }

    coverImageElement.src = metadata.image;
    coverImageElement.alt = metadata.imageAlt || "";
    coverCaptionElement.textContent = metadata.imageCaption || "";
    coverCaptionElement.hidden = !metadata.imageCaption;
    coverElement.hidden = false;
  }

  function renderArchive(activeSlug) {
    archiveElement.innerHTML = "";

    writings.forEach(function (item) {
      var link = document.createElement("a");
      var meta = item.metadata;
      var date = formatDate(meta.date);

      link.className = "writings-archive-link";
      link.href = "/writings/#" + encodeURIComponent(item.slug);
      link.setAttribute("data-writing-slug", item.slug);
      link.setAttribute(
        "aria-current",
        item.slug === activeSlug ? "page" : "false"
      );

      link.innerHTML =
        '<span class="writings-archive-title">' +
        escapeHtml(meta.title || item.slug) +
        "</span>" +
        (date
          ? '<span class="writings-archive-date">' + escapeHtml(date) + "</span>"
          : "");

      archiveElement.appendChild(link);
    });
  }

  function renderWriting(slug) {
    var item =
      writings.find(function (candidate) {
        return candidate.slug === slug;
      }) || writings[0];

    if (!item) {
      titleElement.textContent = "No writings found";
      bodyElement.innerHTML =
        '<p class="writing-loading">Add Markdown files to the writings manifest to publish them here.</p>';
      return;
    }

    var metadata = item.metadata;
    var articleBody = stripLeadTitle(item.body, metadata);
    var date = formatDate(metadata.date);

    titleElement.textContent = metadata.title || item.slug;
    subtitleElement.textContent = metadata.subtitle || "";
    subtitleElement.hidden = !metadata.subtitle;
    dateElement.textContent = date;
    dateElement.hidden = !date;
    bodyElement.innerHTML = markdownToHtml(articleBody);
    renderCover(metadata);
    enhanceRenderedBody();
    renderArchive(item.slug);

    document.title = (metadata.title || "Writings") + " | Ariel Noyman";

    if (metadata.description) {
      var description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute("content", metadata.description);
      }
    }
  }

  function loadWriting(item) {
    var file = item.file;

    return fetch("/writings/" + file)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Could not load " + file);
        }
        if (/\.json(?:$|\?)/i.test(file)) {
          return response.json();
        }
        return response.text().then(parseFrontMatter);
      })
      .then(function (parsed) {
        var metadata = parsed.metadata || {};
        return {
          file: file,
          slug: parsed.slug || metadata.slug || slugFromFile(file),
          metadata: metadata,
          body: parsed.body || ""
        };
      });
  }

  function loadFooter() {
    if (!footerElement) {
      return;
    }

    fetch("/footer/footer.html")
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        footerElement.innerHTML = html;
      })
      .catch(function () {
        footerElement.innerHTML = "";
      });
  }

  fetch(manifestUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load writings manifest.");
      }
      return response.json();
    })
    .then(function (manifest) {
      return Promise.all((manifest.items || []).map(loadWriting));
    })
    .then(function (loadedWritings) {
      writings = loadedWritings.sort(sortByDateDescending);
      renderWriting(currentSlug());
    })
    .catch(function (error) {
      console.error(error);
      titleElement.textContent = "Writings could not be loaded";
      bodyElement.innerHTML =
        '<p class="writing-loading">Please try refreshing the page.</p>';
      if (archiveElement) {
        archiveElement.innerHTML = "";
      }
    });

  window.addEventListener("hashchange", function () {
    renderWriting(currentSlug());
  });

  if (archiveElement) {
    archiveElement.addEventListener("click", function (event) {
      var link = event.target.closest("[data-writing-slug]");
      if (!link) {
        return;
      }
      event.preventDefault();
      setCurrentSlug(link.getAttribute("data-writing-slug"));
    });
  }

  loadFooter();
})();
