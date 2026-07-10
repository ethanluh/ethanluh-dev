export interface ProjectEntry {
  slug: string;
  number: string;
  title: string;
  tag: string;
  description: string;
  href?: string;
  image?: string;
}

// Featured status and display order are computed at build time via hull
// peeling over each entry's ContentPoint (src/data/content-points.ts) — see
// index.astro. Don't add a manual `featured` flag back here.
export const projects: ProjectEntry[] = [
  {
    slug: "zero-forcing-polytopes",
    number: "01",
    title: "Zero Forcing Polytopes",
    tag: "python",
    description:
      "Computational companion to the research above — builds the zero forcing polytope from a graph's minimum forcing sets and enumerates its lattice points. The open problem: forcing-set enumeration blows up combinatorially past small graphs, so the code has to prune the search rather than brute-force it.",
    image: "/placeholder-project.svg",
  },
  {
    slug: "preference-layer",
    number: "02",
    title: "preference-layer",
    tag: "python",
    description: "Portable preference infrastructure and API for the agentic web — user-controlled preference credentials and profile-conditioned product intelligence for AI shopping agents.",
    href: "https://github.com/ethanluh/preference-layer",
    image: "/preference-layer-diagram.svg",
  },
  {
    slug: "quire",
    number: "03",
    title: "quire",
    tag: "typescript",
    description: "Triage tool for high-volume AI-generated pull requests — groups PRs by product direction so you review bundles, not diffs.",
    href: "https://github.com/ethanluh/quire",
    image: "/quire-diagram.svg",
  },
  {
    slug: "market-sentiment-predictor",
    number: "04",
    title: "market-sentiment-predictor",
    tag: "python · graph diffusion",
    description:
      "Models how a signal (an 8-K, a press release) propagates through the market's information hierarchy — sec_corp → institutional → fin_press → informed_retail → uninformed_retail — as a continuous-time heat kernel on the graph Laplacian, then feeds the diffusion lag into 9 quantile-regression models predicting P10/P50/P90 forward returns at three horizons. The gotcha: diffusion has to run on the Laplacian transpose, or the signal propagates backwards against edge direction.",
    href: "https://github.com/ethanluh/market-sentiment-predictor",
    image: "/market-sentiment-diagram.svg",
  },
];
