export interface ProjectEntry {
  number: string;
  title: string;
  tag: string;
  description: string;
  href: string;
}

// Zero-forcing/Ehrhart repo listed first per site content plan — not yet
// pushed to GitHub, so it links nowhere until that changes.
export const projects: ProjectEntry[] = [
  {
    number: "01",
    title: "Zero Forcing Polytopes",
    tag: "python · code coming soon",
    description: "Computational companion to the research above — polytope construction and enumeration code.",
    href: "#",
  },
  {
    number: "02",
    title: "preference-layer",
    tag: "python",
    description: "Portable preference infrastructure and API for the agentic web — user-controlled preference credentials and profile-conditioned product intelligence for AI shopping agents.",
    href: "https://github.com/ethanluh/preference-layer",
  },
  {
    number: "03",
    title: "quire",
    tag: "typescript",
    description: "Triage tool for high-volume AI-generated pull requests — groups PRs by product direction so you review bundles, not diffs.",
    href: "https://github.com/ethanluh/quire",
  },
  {
    number: "04",
    title: "market-sentiment-predictor",
    tag: "python",
    description: "Graph theory based market sentiment predictor.",
    href: "https://github.com/ethanluh/market-sentiment-predictor",
  },
];
