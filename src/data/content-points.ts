import { copy } from "../lib/copy";

export type ContentPoint = {
  slug: string;
  title: string;
  kind: "project" | "research" | "experience";
  href: string;
  // Hand-placed, not embedding-derived — see colophon. 0..1 throughout.
  topic: number; // 0 = pure combinatorics/math ... 1 = pure ML/software
  recency: number; // 0 = oldest ... 1 = newest
  depth: number; // 0..1, effort/complexity judgment — used for hull peeling, not Delaunay
};

export const CONTENT_POINTS: ContentPoint[] = [
  {
    slug: "zero-forcing-polytopes-research",
    title: copy("contentPoints.zeroForcingPolytopesResearch.label"),
    kind: "research",
    href: "#content-zero-forcing-polytopes-research",
    topic: 0.05,
    recency: 0.95,
    depth: 0.95,
  },
  {
    slug: "zero-forcing-polytopes",
    title: copy("contentPoints.zeroForcingPolytopes.label"),
    kind: "project",
    href: "#content-zero-forcing-polytopes",
    topic: 0.1,
    recency: 0.95,
    depth: 0.9,
  },
  {
    slug: "preference-layer",
    title: copy("contentPoints.preferenceLayer.label"),
    kind: "project",
    href: "https://github.com/ethanluh/preference-layer",
    topic: 0.65,
    recency: 0.7,
    depth: 0.6,
  },
  {
    slug: "quire",
    title: copy("contentPoints.quire.label"),
    kind: "project",
    href: "https://github.com/ethanluh/quire",
    topic: 0.75,
    recency: 0.85,
    depth: 0.55,
  },
  {
    slug: "market-sentiment-predictor",
    title: copy("contentPoints.marketSentimentPredictor.label"),
    kind: "project",
    href: "https://github.com/ethanluh/market-sentiment-predictor",
    topic: 0.55,
    recency: 0.4,
    depth: 0.45,
  },
  {
    slug: "agentmade-internship",
    title: copy("contentPoints.agentmadeInternship.label"),
    kind: "experience",
    href: "#content-agentmade-internship",
    topic: 0.7,
    recency: 0.8,
    depth: 0.5,
  },
  {
    slug: "uas-software-lead",
    title: copy("contentPoints.uasSoftwareLead.label"),
    kind: "experience",
    href: "#content-uas-software-lead",
    topic: 0.6,
    recency: 0.9,
    depth: 0.55,
  },
];
