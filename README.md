Ariel Noyman's personal website.

Built as a static HTML-first site, originally based on the
[Freelancer template](https://startbootstrap.com/previews/freelancer/).

## Project pages

The homepage project grid reads `projects/projects.json`. Each project also has
one detail file at `projects/<slug>/<slug>.json`.

Permanent project URLs are generated as static files:

```sh
node tools/generate-project-pages.js
```

The generator writes `projects/<slug>/index.html` for every project in
`projects/projects.json`, using `templates/project-page.html`,
`footer/footer.html`, and the existing project JSON data.

## Adding a project

1. Create `projects/<slug>/<slug>.json`.
2. Add images or other media inside `projects/<slug>/`.
3. Add the project entry to `projects/projects.json` with `name`, `title`, and
   `imageSrc`.
4. Run `node tools/generate-project-pages.js`.
5. Commit the JSON, media, and generated `projects/<slug>/index.html`.

## Homepage selected lists

The homepage loads the selected publications, talks, and awards from shared
section partials:

- `sections/publications.html`
- `sections/talks.html`
- `sections/awards.html`

## Adding a writing

The writings page at `/writings/` renders Markdown directly in the browser. No
per-article HTML generation is required.

1. Add a Markdown file inside `writings/`.
2. Add images or other linked media in the same folder or another public path.
3. Add the Markdown filename to `writings/writings.json`.
4. Use front matter for metadata:

```md
---
title: "Post title"
subtitle: "Optional subtitle"
slug: "post-title"
date: "2026-06-30"
description: "Short summary for metadata."
image: "/writings/example.jpg"
imageAlt: "Description of the image"
---
```

The latest dated entry opens by default. Older entries appear in the left
archive.

GitHub Pages can deploy the committed static files directly. No backend,
database, CMS, or JavaScript framework is required.
