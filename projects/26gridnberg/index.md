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
Pedestrian network models typically represent streets on a flat plane, although slope affects walking effort, route choice, and accessibility. Gridnberg ("grid-n-berg," combining grid and mountain) is a topography-aware network dataset and routing framework for New York City. It joins the NYCWalks pedestrian network with municipal elevation observations so that terrain can be examined as part of the network rather than as a separate surface.

## Method

Elevation is estimated at each network vertex from selected roadbed and bridge observations within a 50-meter radius. Segments are included only when elevation support is available along their complete geometry. The workflow then derives horizontal length, cumulative ascent and descent, endpoint-average grade, and maximum local grade, allowing the cost of traversing a segment to vary by direction.

Three routing profiles provide a controlled comparison: shortest horizontal distance, a comfort-oriented slope cost, and an accessibility-sensitive cost with higher slope penalties. These profiles are intended as interpretable scenarios rather than calibrated travel-time models. The accompanying application shows how the selected path changes under each profile and reports the corresponding distance and elevation characteristics.

## Research Use and Limitations

Gridnberg provides a reproducible basis for studying how terrain influences pedestrian routes, catchment areas, centrality, and foot-traffic models. The release includes analytical tables, geospatial files, application data, and the notebook used to construct the network.

The elevation values are local estimates rather than survey measurements. Errors can occur where observations from bridges, underpasses, stairs, or closely stacked infrastructure are difficult to distinguish. The network also does not describe cross slope, curb ramps, surface condition, obstacles, legal access, or temporary closures. The accessibility-sensitive profile should therefore be understood as a research scenario, not as an accessibility or compliance assessment.

## Citation

Noyman, A. (2026). <a href="https://arxiv.org/abs/2607.22523"><em>Gridnberg: A Topography-Aware Pedestrian Routing Dataset for New York City</em></a>. arXiv:2607.22523 [cs.HC]. https://doi.org/10.48550/arXiv.2607.22523

The source pedestrian network is documented in Sevtsuk, A., Basu, R., Liu, L., Alhassan, A., et al. (2026), <em>Spatial distribution of foot traffic in New York City and applications for urban planning</em>, <em>Nature Cities</em>, 3, 136–145.
