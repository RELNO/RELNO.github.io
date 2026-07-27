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
    value: "Dataset, software, interactive web app, and paper"
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
    alt: "Gridnberg map comparing distance, accessible, and comfort pedestrian routes across New York City"
---
Gridnberg ("grid-n-berg," grid and mountain) is a topography-aware pedestrian routing dataset, reproducible workflow, and interactive web app for New York City. It enriches the citywide NYCWalks pedestrian network with vertex-level elevations derived from the New York City Planimetric Database, making terrain an explicit and inspectable part of pedestrian-network analysis.

The project compares three transparent routing scenarios: a horizontal-distance shortest path, a comfort-oriented route with moderate slope penalties, and an accessibility-sensitive route with stronger penalties, particularly for grades above 8.33%. The live app lets users move an origin and destination across the city, compare the resulting paths, and inspect their distance, elevation gain and loss, and maximum reported grade.

## From Street Network to Terrain-Aware Routes

The workflow assigns elevation to each network vertex by averaging selected roadbed and bridge elevation observations within a 50-meter radius. It retains segments only when every geometry vertex has local elevation support, preserving 313,184 of 315,577 source segments (99.24%). Cumulative ascent and descent are calculated separately so that slope-aware routing costs can differ by direction.

The analytical release contains 187,657 endpoint nodes and 313,184 physical segments, represented as 626,368 directed edges for routing. It includes routing-network and node tables, a QGIS project and GeoPackage, browser-optimized app data, and the notebook used to reproduce the analysis.

## Reading the Results

Across the released network, 12.79% of segments contain a reported local grade of at least 5%, and 6.84% reach at least 8.33%. Route comparisons show how modest detours can reduce cumulative climbing or avoid steep edges, while also exposing cases where bridges, stacked infrastructure, short geometry steps, or mismatched elevation observations create implausible values.

Grade reference points of 5% (1:20) and 8.33% (1:12) help frame the cost scenarios, but the profiles are heuristic comparative scores rather than travel-time estimates or compliance labels. The dataset measures running slope, but not cross slope, curb ramps, sidewalk width, surface condition, obstacles, signal timing, legal access, or temporary constraints. Gridnberg supports reproducible terrain-aware analysis; it does not certify that a route is accessible or barrier-free.

## Citation

Noyman, A. (2026). <a href="https://arxiv.org/abs/2607.22523"><em>Gridnberg: A Topography-Aware Pedestrian Routing Dataset for New York City</em></a>. arXiv:2607.22523 [cs.HC]. https://doi.org/10.48550/arXiv.2607.22523

The source pedestrian network is documented in Sevtsuk, A., Basu, R., Liu, L., Alhassan, A., et al. (2026), <em>Spatial distribution of foot traffic in New York City and applications for urban planning</em>, <em>Nature Cities</em>, 3, 136–145.
