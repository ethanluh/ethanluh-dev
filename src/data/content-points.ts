export type ContentPoint = {
  slug: string;
  title: string;
  kind: "project" | "research" | "experience";
  href: string;
  // Hand-placed, not embedding-derived — see colophon. 0..1 throughout.
  topic: number; // 0 = pure combinatorics/math ... 1 = pure ML/software
  recency: number; // 0 = oldest ... 1 = newest
  depth: number; // 0..1, effort/complexity judgment — used for hull peeling, not Delaunay
  // true = a real public repo someone can click into today; false = explicitly
  // in-progress/unreleased; omitted = not applicable (experience entries).
  // Adjusts the hull-peel's depth axis (see index.astro) so an unfinished
  // deep-research entry can't outrank shipped work for the featured slot.
  shipped?: boolean;
};

export const CONTENT_POINTS: ContentPoint[] = [
  {
    slug: "zero-forcing-polytopes-research",
    title: "Zero Forcing Polytopes (research)",
    kind: "research",
    href: "#content-zero-forcing-polytopes-research",
    topic: 0.05,
    recency: 0.95,
    depth: 0.95,
    shipped: false,
  },
  {
    slug: "zero-forcing-polytopes",
    title: "Zero Forcing Polytopes",
    kind: "project",
    href: "#content-zero-forcing-polytopes",
    topic: 0.1,
    recency: 0.95,
    depth: 0.9,
    shipped: false,
  },
  {
    slug: "preference-layer",
    title: "preference-layer",
    kind: "project",
    href: "https://github.com/ethanluh/preference-layer",
    topic: 0.65,
    recency: 0.7,
    depth: 0.6,
    shipped: true,
  },
  {
    slug: "quire",
    title: "quire",
    kind: "project",
    href: "https://github.com/ethanluh/quire",
    topic: 0.75,
    recency: 0.85,
    depth: 0.55,
    shipped: true,
  },
  {
    slug: "market-sentiment-predictor",
    title: "market-sentiment-predictor",
    kind: "project",
    href: "https://github.com/ethanluh/market-sentiment-predictor",
    topic: 0.55,
    recency: 0.4,
    depth: 0.45,
    shipped: true,
  },
  {
    slug: "agentmade-internship",
    title: "Software Engineering Intern, AgentMade",
    kind: "experience",
    href: "#content-agentmade-internship",
    topic: 0.7,
    recency: 0.8,
    depth: 0.5,
  },
  {
    slug: "uas-software-lead",
    title: "Software Team Lead, UAS Club",
    kind: "experience",
    href: "#content-uas-software-lead",
    topic: 0.6,
    recency: 0.9,
    depth: 0.55,
  },
];
