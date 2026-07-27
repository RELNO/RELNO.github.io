---
title: "Gridnberg"
subtitle: "Topography-aware pedestrian routing for New York City"
order: 5
imageSrc: "projects/26gridnberg/gridnberg.jpeg"
themes:
  - "city-science"
  - "publication"
badges:
  - label: "Paper"
    link: "https://arxiv.org/abs/2607.22523"
  - label: "Web App"
    link: "https://www.arielnoyman.com/gridnberg/"
  - label: "GitHub"
    link: "https://github.com/RELNO/gridnberg"
  - label: "Data"
    link: "https://github.com/RELNO/gridnberg/tree/main/outputs"
  - label: "Source Network"
    link: "https://doi.org/10.1038/s44284-025-00383-y"
credits:
  - label: "Type"
    value: "Research dataset and routing application"
  - label: "Date"
    value: "2026"
  - label: "Author"
    value: "Ariel Noyman"
  - label: "Publication"
    value: "arXiv:2607.22523 [cs.HC]"
  - label: "Source Data"
    value: "NYC pedestrian network by Sevtsuk, Basu, Liu, Alhassan et al.; NYC Planimetric Database elevation points"
carouselItems:
  - type: "image"
    src: "projects/26gridnberg/gridnberg.jpeg"
    alt: "Gridnberg map comparing distance, accessibility-sensitive, and comfort-oriented pedestrian routes across New York City"
---
Cities are rarely flat, yet urban network analysis usually represents streets as planar graphs. This simplification affects modeled impedance, route choice, and the interpretation of accessibility, particularly where alternative paths differ in grade. This paper introduces Gridnberg ('grid-n-berg', grid and mountain), a topography-aware pedestrian routing dataset for New York City. The dataset enriches the NYCWalks network with vertex-level elevations derived from the New York City Planimetric Database. For each pedestrian-network geometry vertex, the workflow averages selected elevation observations within a 50 m radius, retains segments with complete vertex support, and uses direction-specific cumulative ascent and descent to calculate three routing costs: horizontal distance, a comfort-oriented slope score, and an accessibility-sensitive slope score. The release retains 313184 of 315577 source segments (99.24%). Gridnberg supports reproducible terrain-aware analysis, transparent scenario comparison, and improved pedestrian-network representations in New York and other cities.
