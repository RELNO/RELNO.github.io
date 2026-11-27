#!/usr/bin/env bash
set -euo pipefail

# Export the public site from the current source commit into an empty directory.
out=${1:?Specify a staging directory}
mkdir -p "$out"
git archive HEAD -- .nojekyll index.html css footer img projects sections work \
  robots.txt sitemap.xml resume/resume.pdf '*.pdf' ':(exclude,glob)projects/**/*.md' |
  tar -x -C "$out"

cp templates/old-pages-404.html "$out/404.html"
for repo in ${LEGACY_PAGES_SITES:-gridnberg travelAgent}; do
  if [[ ! "$repo" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ || -e "$out/$repo" ]]; then
    echo "Invalid or conflicting legacy Pages path: $repo" >&2
    exit 1
  fi
  mkdir "$out/$repo"
  sed "s/{{repo}}/$repo/g" templates/old-pages-entry.html > "$out/$repo/index.html"
done
