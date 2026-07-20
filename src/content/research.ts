import { copy } from "../lib/copy";
import { CONTACT_EMAIL } from "./site";

export interface ResearchEntry {
  slug: string;
  number: string;
  title: string;
  status: string;
  updated: string;
  abstract: string;
  impact: string;
  links: { label: string; href: string }[];
}

export const research: ResearchEntry[] = [
  {
    slug: "zero-forcing-polytopes-research",
    number: "00",
    title: copy("research.zeroForcingPolytopesResearch.title"),
    status: copy("research.zeroForcingPolytopesResearch.status"),
    updated: "2026-07",
    abstract: copy("research.zeroForcingPolytopesResearch.abstract"),
    impact: copy("research.zeroForcingPolytopesResearch.impact"),
    links: [
      {
        label: copy("research.zeroForcingPolytopesResearch.notesLinkLabel"),
        href: `mailto:${CONTACT_EMAIL}?subject=Zero%20forcing%20polytopes%20notes`,
      },
    ],
  },
];
