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
3. Add the project entry to `projects/projects.json` with `name`, `title`,
   `imageSrc`, and `themes`.
4. Run `node tools/generate-project-pages.js`.
5. Commit the JSON, media, and generated `projects/<slug>/index.html`.

Project themes drive the homepage filters. Current theme values are
`architecture`, `urbanism`, `city-science`, and `writing`. Writings are regular
projects: add the `writing` theme, use the same project JSON fields, and write
the article body in the project `text` value. Writing project slugs use the
compact `YYword` pattern, such as `26charrette`.

## Homepage selected lists

The homepage loads the selected publications, talks, and awards from shared
section partials:

- `sections/publications.html`
- `sections/talks.html`
- `sections/awards.html`

GitHub Pages can deploy the committed static files directly. No backend,
database, CMS, or JavaScript framework is required.
