import { copy } from "../lib/copy";

export interface ExperienceEntry {
  slug: string;
  number: string;
  role: string;
  org: string;
  dates: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    slug: "agentmade-internship",
    number: "01",
    role: copy("experience.agentmadeInternship.role"),
    org: copy("experience.agentmadeInternship.org"),
    dates: "Summer 2026",
    description: copy("experience.agentmadeInternship.description"),
  },
  {
    slug: "uas-software-lead",
    number: "02",
    role: copy("experience.uasSoftwareLead.role"),
    org: copy("experience.uasSoftwareLead.org"),
    dates: "Fall 2025–present",
    description: copy("experience.uasSoftwareLead.description"),
  },
];
