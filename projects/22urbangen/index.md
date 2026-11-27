---
workSlug: "generative-urbanism"
title: "Generative Urbanism"
subtitle: "Generative AI for Cities"
dateModified: "2026-11-27"
order: 50
imageSrc: "projects/22urbangen/0.jpg"
themes:
  - "city-science"
badges:
  - label: "LinkedIn Post"
    link: "https://www.linkedin.com/posts/arielnoyman_controlnet-threejs-activity-7049133189168017408-tEZZ?utm_source=share&utm_medium=member_desktop"
  - label: "Related MIT project: Immersive Scope"
    link: "https://www.media.mit.edu/projects/an-immersive-user-interface-experience-for-urban-exploration/overview/"
carouselItems:
  - type: "video"
    src: "projects/22urbangen/sdxl-turbo-city.mp4"
    mime: "video/mp4"
    caption: "The browser prototype updates the generated scene as the design changes."
    loop: true
  - type: "link"
    src: "https://i.ytimg.com/vi/ZDB_OJnEGWk/hqdefault.jpg"
    link: "https://www.youtube.com/watch?v=ZDB_OJnEGWk"
    caption: "Generating a street view with Three.js, Stable Diffusion and ControlNet"
  - type: "image"
    src: "projects/22urbangen/1.gif"
    alt: "A model of building footprints and green space sits beside the generated view of the same urban block."
    caption: "The plan on the left supplies the arrangement of the buildings in the image on the right."
---
A designer can change a three-dimensional block in the browser and see what the new arrangement looks like from the street. Three.js draws the model. ControlNet guides image generation so the new view follows the geometry. A designer can compare alternatives from the same viewpoint or look around a 360-degree panorama.

The related MIT project *Immersive Scope* takes this idea into a collaborative setting. It combines a depth map from a CityScope model with a spoken description of the desired street, letting participants try out a change in ordinary language.
