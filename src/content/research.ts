import { copy } from "../lib/copy";

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
    title: copy("research.zeroForcingPolytopesResearch.title"),
    status: copy("research.zeroForcingPolytopesResearch.status"),
    updated: "2026-07",
    abstract: copy("research.zeroForcingPolytopesResearch.abstract"),
    links: [],
  },
];
