---
title: "Beyond the Rulebook"
subtitle: "Agent-based modeling in nondeterministic environments"
metaDescription: "A subway-station simulation comparing Jev and GPT-6 on ambiguous passenger requests, response time, and routing accuracy."
dateModified: "2026-09-25"
order: 3
imageSrc: "projects/26agents/simulation-cover.jpg"
themes:
  - "city-science"
  - "architecture"
credits:
  - label: "Date"
    value: "2026"
  - label: "Platform"
    value: "GAMA"
  - label: "Models"
    value: "TypeSafe AI Jev 1.13 and OpenAI GPT-6 Luna"
carouselItems:
  - type: "video"
    src: "projects/26agents/comparison-horizontal.mp4"
    mime: "video/mp4"
    poster: "projects/26agents/comparison-poster.jpg"
    autoplay: true
    muted: true
    loop: true
    preload: "metadata"
    alt: "Passenger routes around the information desk in a simulated subway station"
    caption: "Jev and GPT-6 Luna responding to identical passenger requests in a simulated subway station."
---
Agent-based models use explicit rules to produce complex behaviors at scale. Deciding what an agent should do in an ambiguous situation is harder. Large language models can interpret incomplete information, but repeated calls add latency and cost. This experiment compares that approach with Jev, TypeSafe AI's model for turning partial information into structured responses.

Built in GAMA, the simulation represents a simplified New York City subway station with 300 passengers arriving over three minutes. Thirty stop at an information desk with open-ended requests: finding an airport train, reaching a platform without stairs, or realizing they are in the wrong station. Jev and OpenAI's GPT-6 Luna receive identical requests and use shared routing rules.

In this test, Jev's median API response time was **224 ms**, compared with **1,511 ms** for GPT-6 Luna, approximately seven times faster. Initial accuracy was **28/30** and **29/30**, respectively. Both produced the same final route assignments, while the Jev scenario finished about **20% earlier in simulated time**.

The experiment explores how models can guide agents through uncertain situations in spatial environments, with potential applications in visitor guidance, service routing, and other systems that translate incomplete information into structured decisions.
