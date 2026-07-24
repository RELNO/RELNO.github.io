Ariel Noyman's personal website.

Built as a static HTML-first site, originally based on the
[Freelancer template](https://startbootstrap.com/previews/freelancer/).

## Project pages

Project content is authored in Markdown. Each project has one source file at
`projects/<slug>/index.md`, with YAML front matter for metadata and a Markdown
body for the page text.

Permanent project URLs are generated as static files:

```sh
python3 -m pip install -r tools/requirements.txt
python3 tools/generate-project-thumbnails.py
node tools/generate-project-pages.js
```

The generator writes `projects/<slug>/index.html` for every project in
`projects/<slug>/index.md`, using `templates/project-page.html` and
`footer/footer.html`. It also regenerates `projects/projects.json` for the
homepage grid; treat that JSON file as generated output, not as the editing
source. The thumbnail step creates responsive, center-cropped WebP assets under
`img/project-thumbnails/` for homepage cards. Project pages continue to use the
original full-resolution media declared in each Markdown file.

## Adding a project

1. Create `projects/<slug>/index.md`.
2. Add images or other media inside `projects/<slug>/`.
3. Add front matter with `title`, `order`, `imageSrc`, and `themes`.
4. Run `python3 tools/generate-project-thumbnails.py`, then
   `node tools/generate-project-pages.js`.
5. Commit the Markdown, media, generated `projects/<slug>/index.html`, and
   generated `projects/projects.json`.

Project themes drive the homepage filters. Current theme values are
`architecture`, `urbanism`, `city-science`, `writing`, `publication`, `talk`,
and `award`. Writings are regular projects: add the `writing` theme and write
the article body below the front matter. Talks, publications, and awards should
usually be added to the relevant project as links, media, credits, and themes
rather than maintained as a separate list.

Common front matter fields:

```yaml
---
title: "Project Page Title"
listTitle: "Optional shorter homepage title"
subtitle: "Optional page subtitle"
order: 10
imageSrc: "projects/example/0.jpg"
themes:
  - "architecture"
badges:
  - label: "Project Link"
    link: "https://example.com"
credits:
  - label: "Date"
    value: "2026"
carouselItems:
  - type: "image"
    src: "projects/example/0.jpg"
    alt: "Short image description"
---
```

GitHub Pages can deploy the committed static files directly. No backend,
database, CMS, or JavaScript framework is required.

## Resume

The resume source is maintained in `resume/`. A path-scoped GitHub Actions
workflow compiles `resume/resume.tex` only when that folder changes, commits the
generated PDF, and requests a Pages rebuild. The public download URL is
`https://www.arielnoyman.com/resume/resume.pdf`.
