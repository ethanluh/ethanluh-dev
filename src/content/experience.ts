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
    role: "Software Engineering Intern",
    org: "AgentMade",
    dates: "Summer 2026",
    description: "Built and open-sourced Quire (see Projects), a triage multiplexer for AI-generated pull requests, as the core engineering contribution on a 5-person engineering team — took each engineer's reviewable PR-bundle throughput from ~10/day to 30+/day.",
  },
  {
    slug: "uas-software-lead",
    number: "02",
    role: "Software Team Lead",
    org: "UAS Club, Penn State Behrend",
    dates: "Fall 2025–present",
    description: "Leads a 10-person software team building Behrend_UAS, a CI-tested drone pipeline — a YOLOv8 model trained on Blender-synthesized data detects mannequins and tents, and a Python perception-control node plus a low-latency C++ ONNX runtime turn detections into autonomous flight guidance, backed by a simulation harness and full documentation.",
  },
];
