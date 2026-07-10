import { copy } from "../lib/copy";

export interface CourseworkEntry {
  number: string;
  title: string;
  tag: string;
  description: string;
}

export const coursework: CourseworkEntry[] = [
  {
    number: "01",
    title: copy("coursework.systemsSoftware.title"),
    tag: copy("coursework.systemsSoftware.tag"),
    description: copy("coursework.systemsSoftware.description"),
  },
  {
    number: "02",
    title: copy("coursework.aiSecurity.title"),
    tag: copy("coursework.aiSecurity.tag"),
    description: copy("coursework.aiSecurity.description"),
  },
  {
    number: "03",
    title: copy("coursework.mathStats.title"),
    tag: copy("coursework.mathStats.tag"),
    description: copy("coursework.mathStats.description"),
  },
];
