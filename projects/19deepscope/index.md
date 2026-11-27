---
workSlug: "deepscope"
title: "DeepScope"
subtitle: "The Deep Image of the City"
order: 60
imageSrc: "projects/19deepscope/0.png"
metaDescription: "Move a tile on a CityScope table and see a proposed street at eye level. DeepScope combines a tangible urban model with a neural network trained on street photographs."
dateModified: "2026-11-27"
themes:
  - "city-science"
  - "publication"
badges:
  - label: "MIT project"
    link: "https://www.media.mit.edu/projects/deep-image-of-the-city/overview/"
  - label: "CHI paper"
    link: "https://doi.org/10.1145/3334480.3382809"
  - label: "SimAUD paper"
    link: "https://www.media.mit.edu/publications/deep-image-of-the-city-a-generative-approach-to-urban-design-visualization/"
credits:
  - label: "Prototype"
    value: "2019, City Science group, MIT Media Lab"
  - label: "Paper authors"
    value: "Ariel Noyman and Kent Larson"
carouselItems:
  - type: "link"
    src: "https://i.ytimg.com/vi/WNI5Y-QWOjI/hqdefault.jpg"
    link: "https://www.youtube.com/watch?v=WNI5Y-QWOjI"
    caption: "DeepScope demonstration by Ariel Noyman, 2019"
  - type: "image"
    src: "projects/19deepscope/0.png"
    alt: "Two people at the illuminated CityScope table, with a street-level view on the monitor above it."
    caption: "The tabletop holds the plan. The upright screen shows the street from the observer’s position."
  - type: "image"
    src: "projects/19deepscope/system-architecture.png"
    alt: "Two paths meet in a street image: Cityscapes training data supplies the image model, and the CityScope table supplies the spatial layout through cityIO."
    caption: "How the trained model and the physical table contribute to a single view. Diagram © Ariel Noyman, 2019."
  - type: "link"
    src: "https://i.ytimg.com/vi/4-J2EJFjoSw/hqdefault.jpg"
    link: "https://www.youtube.com/watch?v=4-J2EJFjoSw"
    autoplay: false
    caption: "SimAUD 2020 paper presentation"
---
What would a proposed street look like to someone standing on its sidewalk? At the stage when a design team can still move a building or trade parking for trees, it often has little more than a plan. DeepScope lets people around a CityScope table make that change and see a street-level image before they settle on a layout.

## Designing from the sidewalk

The prototype uses a 16-by-16 grid of LEGO tiles. A scanner reads the pattern underneath each tile to identify a road, building, green space, parking area, or sidewalk. One additional tile represents an observer. Placing it at a corner and turning it selects the position and direction of the view. The projected plan shows where the observer is looking, so everyone at the table can connect the image on the upright screen to a particular stretch of street.

## How the image is made

The software builds a simple three-dimensional scene from the plan. A green-space tile can introduce trees and shrubs, and a parking tile can introduce cars. From the observer’s position, the software draws a color-coded view in which each color identifies a kind of surface or object. DeepScope uses pix2pix, a generative adversarial network trained on pairs of street photographs and labeled images from the Cityscapes dataset. It translates the color-coded view into a streetscape in the browser. [Cityscapes dataset](https://www.cityscapes-dataset.com/dataset-overview/)

That division of labor matters in a design discussion. Participants choose where the street runs and how much space to give a building. The model supplies visual details such as façade texture from examples it has seen. Two layouts can therefore be compared from the same corner while the eventual materials and architecture remain open.

## Publications and exhibition

Ariel Noyman and Kent Larson described the interface in *DeepScope: HCI Platform for Generative Cityscape Visualization* (CHI Extended Abstracts, 2020) and the visualization method in *A Deep Image of the City: Generative Urban-Design Visualization* (SimAUD, 2020). Later that year, DeepScope introduced Noyman’s CityScope work in the City Catalyst section of Hebei International Industrial Design Week’s Young Talent exhibition. [MIT exhibition account](https://www.media.mit.edu/posts/ariel-noyman-recognized-by/)
