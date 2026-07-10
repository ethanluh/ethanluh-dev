import { copy } from "../lib/copy";

export interface CourseworkEntry {
  slug: string;
  number: string;
  title: string;
  tag: string;
  description: string;
}

export const coursework: CourseworkEntry[] = [
  {
    slug: "systems-software",
    number: "01",
    title: copy("coursework.systemsSoftware.title"),
    tag: copy("coursework.systemsSoftware.tag"),
    description: copy("coursework.systemsSoftware.description"),
  },
  {
    slug: "ai-security",
    number: "02",
    title: copy("coursework.aiSecurity.title"),
    tag: copy("coursework.aiSecurity.tag"),
    description: copy("coursework.aiSecurity.description"),
  },
  {
    slug: "math-stats",
    number: "03",
    title: copy("coursework.mathStats.title"),
    tag: copy("coursework.mathStats.tag"),
    description: copy("coursework.mathStats.description"),
  },
];
