export interface ResearchEntry {
  slug: string;
  number: string;
  title: string;
  status: string;
  updated: string;
  abstract: string;
  links: { label: string; href: string }[];
}

export const research: ResearchEntry[] = [
  {
    slug: "zero-forcing-polytopes-research",
    number: "01",
    title: "Zero Forcing Polytopes",
    status: "in progress",
    updated: "2026-07",
    abstract:
      "Independent study with Hanely applying Ehrhart theory to zero forcing polytopes on small graph families. Constructs the polytope from a graph's zero forcing sets and studies its lattice-point structure, motivated by the conjecture |𝓕_G| ≥ ⌈n/3⌉ on the number of forcing sets of minimum size.",
    links: [],
  },
];
