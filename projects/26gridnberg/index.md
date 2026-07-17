---
title: "Gridnberg"
subtitle: "Topography-aware pedestrian routing for New York City"
order: 5
imageSrc: "projects/26gridnberg/gridnberg.jpeg"
themes:
  - "city-science"
  - "publication"
badges:
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
    value: "Data set, software, and interactive web app"
  - label: "Date"
    value: "2026"
  - label: "Author"
    value: "Ariel Noyman"
  - label: "Source Data"
    value: "NYC pedestrian network by Sevtsuk, Basu, Liu, Alhassan et al.; NYC Planimetric Database elevation points"
carouselItems:
  - type: "image"
    src: "projects/26gridnberg/gridnberg.jpeg"
    alt: "Gridnberg map comparing distance, accessible, and comfort pedestrian routes across New York City"
---
Gridnberg ("grid on a hill") is a topography-aware pedestrian routing dataset, reproducible workflow, and interactive web app for New York City. It adds local elevation to an existing pedestrian network, calculates grade along each segment, and demonstrates how route choice changes when the city is understood in three dimensions.

The project compares three transparent routing scenarios: an ordinary 2D shortest path, a comfort route with moderate penalties for uphill, downhill, and steep grades, and an accessibility-sensitive route with stronger slope penalties. The live app lets users drag an origin and destination across the city, compare the resulting paths, and inspect their distance, elevation gain and loss, and maximum grade in real time.

## From Street Network to Terrain-Aware Routes

The workflow assigns elevation to each network vertex by averaging nearby NYC planimetric elevation points within a 50-meter radius. It retains only segments with local elevation support, then stores directional slope-aware costs for travel in both directions. The resulting public dataset includes routing-network and node tables, a QGIS project and GeoPackage, browser-optimized app data, and the notebook used to rebuild the analysis.

Grade reference points of 5% (1:20) and 8.33% (1:12) help frame the cost scenarios. These costs are comparative scores rather than travel-time estimates or compliance labels: the dataset measures running slope, but not cross slope, curb ramps, sidewalk width, surface condition, obstacles, signal timing, or temporary access constraints. Gridnberg is therefore a tool for terrain-aware urban analysis, not an accessibility certification.

## Citation

Noyman, A. (2026). <em>Gridnberg: A topography-aware pedestrian routing dataset for New York City</em> [Data set and software].

The source pedestrian network is documented in Sevtsuk, A., Basu, R., Liu, L., Alhassan, A., et al. (2026), <em>Spatial distribution of foot traffic in New York City and applications for urban planning</em>, <em>Nature Cities</em>, 3, 136–145.
