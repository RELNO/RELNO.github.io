# Ariel Noyman Resume

The LaTeX sources for Ariel Noyman's resume live here as part of the
`RELNO.github.io` website repository.

Changes under this folder trigger `.github/workflows/build-resume.yml`. The
workflow compiles `resume.tex`, commits the generated `resume.pdf`, and requests
a GitHub Pages rebuild. Unrelated website commits do not rebuild the PDF.

The published resume is available at
[arielnoyman.com/resume/resume.pdf](https://www.arielnoyman.com/resume/resume.pdf).

To build it locally:

```sh
cd resume
latexmk -pdf -file-line-error -halt-on-error -interaction=nonstopmode resume.tex
```
