export interface ExperienceEntry {
  number: string;
  role: string;
  org: string;
  dates: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    number: "01",
    role: "Software Engineering Intern",
    org: "AgentMade",
    dates: "Summer 2026",
    description: "Built and open-sourced Quire (see Projects), a triage multiplexer for AI-generated pull requests, as the core engineering contribution of the internship.",
  },
  {
    number: "02",
    role: "Software Team Lead",
    org: "UAS Club, Penn State Behrend",
    dates: "Fall 2025–present",
    description: "Leads software development for the club's unmanned aerial systems — computer vision, data processing, and data generation pipelines.",
  },
];
