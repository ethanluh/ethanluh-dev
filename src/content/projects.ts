import { copy } from "../lib/copy";

export interface ProjectEntry {
  slug: string;
  number: string;
  title: string;
  tag: string;
  description: string;
  href?: string;
  links?: { label: string; href: string }[];
  image?: string;
}

// Featured status and display order are computed at build time via hull
// peeling over each entry's ContentPoint (src/data/content-points.ts) — see
// index.astro. Don't add a manual `featured` flag back here.
export const projects: ProjectEntry[] = [
  {
    slug: "zero-forcing-polytopes",
    number: "01",
    title: copy("projects.zeroForcingPolytopes.title"),
    tag: copy("projects.zeroForcingPolytopes.tag"),
    description: copy("projects.zeroForcingPolytopes.description"),
    image: "/placeholder-project.svg",
  },
  {
    slug: "preference-layer",
    number: "02",
    title: copy("projects.preferenceLayer.title"),
    tag: copy("projects.preferenceLayer.tag"),
    description: copy("projects.preferenceLayer.description"),
    href: "https://github.com/ethanluh/preference-layer",
    image: "/preference-layer-diagram.svg",
  },
  {
    slug: "quire",
    number: "03",
    title: copy("projects.quire.title"),
    tag: copy("projects.quire.tag"),
    description: copy("projects.quire.description"),
    links: [
      { label: "app", href: "https://quire-review.com" },
      { label: "code", href: "https://github.com/ethanluh/quire" },
    ],
    image: "/quire-diagram.svg",
  },
  {
    slug: "market-sentiment-predictor",
    number: "04",
    title: copy("projects.marketSentimentPredictor.title"),
    tag: copy("projects.marketSentimentPredictor.tag"),
    description: copy("projects.marketSentimentPredictor.description"),
    href: "https://github.com/ethanluh/market-sentiment-predictor",
    image: "/market-sentiment-diagram.svg",
  },
];
