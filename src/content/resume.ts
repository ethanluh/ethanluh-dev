export interface ResumeBullet {
  bold?: string;
  text: string;
}

export interface ResumeEntry {
  title: string;
  meta?: string;
  subtitle?: string;
  bullets: ResumeBullet[];
}

export const resume = {
  name: "Ethan Luh",
  tagline: "Computer Science · Mathematics",
  profile:
    "CS/Math double major pursuing a PhD in CS Theory. Research in Ehrhart theory and lattice-polytope combinatorics under Dr. Derek Hanely; builds software that spans theoretical enumeration and production engineering.",
  contact: {
    phone: "(650) 660-1907",
    email: "ethanluh@gmail.com",
    site: "ethanluh.com",
  },
  education: {
    degree: "B.S. Computer Science & Mathematics",
    school: "Penn State Behrend",
    detail: "Expected May 2028",
  },
  skills: {
    Languages: ["Python", "C++", "C", "LaTeX"],
    Areas: [
      "Graph algorithms",
      "Machine learning",
      "NLP",
      "Statistical modeling",
      "Lattice polytopes",
      "Combinatorics",
    ],
    Tools: ["Git", "NumPy", "PyTorch", "scikit-learn", "OpenCV"],
  },
  activities: [
    { title: "President, Volleyball Club", meta: "Penn State Behrend · 2024–Present" },
    { title: "Peer Tutor", meta: "CS & Math · 2023–Present" },
    { title: "Math Tutor", meta: "Mathnasium · 2021–2023" },
  ],
  experience: [
    {
      title: "Software Engineering Intern",
      meta: "Summer 2026",
      subtitle: "AgentMade",
      bullets: [
        {
          bold: "Built and open-sourced Quire (see Projects),",
          text: " a triage multiplexer for AI-generated pull requests, as the core engineering contribution of the internship.",
        },
      ],
    },
    {
      title: "Undergraduate Researcher",
      meta: "2024–Present",
      subtitle: "Penn State Behrend — Advisor: Dr. Derek Hanely",
      bullets: [
        {
          bold: "Applying Ehrhart theory",
          text: " (IDP, h*-vector unimodality, unimodular triangulations) to zero forcing polytopes on small graph families.",
        },
        {
          bold: "Computational enumeration",
          text: " via Python; investigating connections between lattice polytope geometry and graph-theoretic parameters.",
        },
      ],
    },
  ] satisfies ResumeEntry[],
  projects: [
    {
      title: "Quire",
      meta: "Python, TypeScript · Open Source",
      subtitle: "Triage multiplexer for AI-generated pull requests",
      bullets: [
        {
          bold: "Groups PRs by declared product direction",
          text: " into bundles, cutting reviewer decision load from one-per-PR to one-per-bundle.",
        },
        {
          bold: "Multi-tenant architecture",
          text: " with fully isolated per-team state and disk-based JSON persistence in place of a database.",
        },
        {
          bold: "Direction-drift detection:",
          text: " flags PRs whose changes silently exceed their declared scope.",
        },
      ],
    },
    {
      title: "PreferenceLayer",
      meta: "Python, FastAPI",
      subtitle: "Portable preference credentials + server-side quality intelligence for agentic shopping",
      bullets: [
        {
          bold: "PTP: user-owned credentials —",
          text: " Ed25519-signed W3C Verifiable-Credential envelope with local differential-privacy updates and an OAuth device flow for cross-platform sync.",
        },
        {
          bold: "QIL: Bayesian quality aggregation —",
          text: " hierarchical Beta-Binomial aggregation over product failure rates plus Gaussian Process modeling for continuous dimensions, served via FastAPI and MCP tool bindings.",
        },
        {
          bold: "Preference/quality blending:",
          text: " learns an α-weighted combination of PTP credentials and QIL posteriors into item scores, evaluated via NDCG/transfer experiments.",
        },
      ],
    },
    {
      title: "market-sentiment-predictor",
      meta: "Python · Open Source",
      subtitle: "News-driven quantile stock-return prediction pipeline",
      bullets: [
        {
          bold: "Multi-source ingestion & FinBERT sentiment:",
          text: " fuses price/volume, news, SEC filings, and Reddit signals into continuous sentiment scores weighted by source credibility and recency decay.",
        },
        {
          bold: "Graph diffusion for impact timing:",
          text: " heat kernel over a directed actor-category graph (SEC/Corp → Institutional → Press → Retail) estimates the lag before price impact, with edges calibrated from historical events.",
        },
        {
          bold: "Quantile regression & backtesting:",
          text: " predicts P10/P50/P90 log-returns across horizons conditioned on VIX regime; benchmarked against momentum/ARIMA/GARCH baselines in a walk-forward backtest, served via FastAPI.",
        },
      ],
    },
  ] satisfies ResumeEntry[],
};
