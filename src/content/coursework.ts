export interface CourseworkEntry {
  number: string;
  title: string;
  tag: string;
  description: string;
}

export const coursework: CourseworkEntry[] = [
  {
    number: "01",
    title: "Systems & Software",
    tag: "coursework",
    description:
      "Data Structures & Algorithms, Computer Organization/Architecture, Operating Systems, Programming Languages, Computer Networks.",
  },
  {
    number: "02",
    title: "AI & Security",
    tag: "coursework",
    description: "Machine Learning, Artificial Intelligence, Computer Vision, Cryptography, Machine Learning + Data Science.",
  },
  {
    number: "03",
    title: "Math & Statistics",
    tag: "coursework",
    description:
      "Discrete Mathematics, Calculus I–III, Linear Algebra, Differential Equations, Statistics I & II, Number Theory, Numerical Analysis.",
  },
];
