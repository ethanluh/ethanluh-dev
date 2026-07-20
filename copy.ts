// copy.ts — source of truth for all site copy.
//
// Edit copy here, not in .astro/.tsx files. Structural data (slugs, hrefs,
// numbers, dates) still lives in src/content/*.ts and src/data/*.ts — this
// file only holds user-facing prose and labels.
//
// `{{placeholder}}` tokens are filled in at render time with computed
// values (counts, etc) — see src/lib/copy.ts.

const COPY = {
  rail: {
    onThisPage: "On this page",
    contact: "Contact",
  },

  nav: {
    brand: {
      name: "Ethan Luh",
      tagline: "field notes from graph theory & code",
    },
    link: {
      mainPage: "main page",
      coursework: "coursework",
      stack: "stack",
      about: "about",
      howItWorks: "how this site works",
      contact: "contact",
      resume: "résumé",
      email: "email",
    },
  },

  home: {
    meta: {
      title: "Ethan Luh — math into working software",
      description:
        "CS/Math/Stats student at Penn State Behrend. Zero forcing research, drone perception, and shipped dev tools like quire.",
    },
    hero: {
      headline: "Math into working software.",
      subhead:
        "I'm Ethan Luh — a CS/Math/Stats student who ships the software his math implies: zero forcing polytope research, an autonomous drone perception pipeline, and dev tools for triaging AI-generated pull requests.",
      ctaMath: "researching zero forcing? → the math",
      ctaEmail: "Email me",
      ctaResume: "Résumé",
      zeroForcingCaptionPrefix: "Hover a node to see what it is, click to visit —",
      zeroForcingCaptionLink: "how this graph works ↓",
      chipProgram: "CS/Math/Stats · Penn State Behrend",
      chipGradDate: "Grad May 2028",
      chipShipped: "3 shipped · 1 live app",
      chipTeam: "10-person team lead",
      chipResearch: "active research",
    },
    work: {
      heading: "Work",
      introPrefix:
        "Research, projects, and experience — ordered by convex-hull peel layer over (recency, depth), not by type. See",
      introLinkLabel: "how this site works",
      stackLine: "Python · TypeScript · PyTorch/YOLOv8 · C++ (ONNX) · graph & combinatorial algorithms",
      stackLinkLabel: "full stack →",
      featuredEyebrow: "featured",
      trackLabel: {
        research: "Research",
        project: "Projects",
        experience: "Experience",
      },
      status: {
        live: "live",
        shipped: "shipped",
        inProgress: "in progress",
      },
      rankReason: {
        featured: "featured — newest, deepest work",
        liveRecent: "live and recent",
        recent: "recent work",
      },
      outro: "That's the field guide. The one-page version is the",
      outroResumeLabel: "résumé",
      outroContactSuffix: "— or skip straight to",
      outroContactLabel: "contact",
    },
    about: {
      heading: "About",
      paragraph1:
        "My interest in zero forcing began while sitting in on an undergraduate thesis defense on the minimal forts of trees, which led me to read, independently, the foundational paper the defense was built upon. The combinatorics is what held my attention. Since then, most of my work has occupied that same intersection—applying mathematical structure to software problems, and using software to test mathematical ones—from the zero forcing polytope research above to a market-signal model built on graph Laplacian diffusion.",
      paragraph2:
        "Outside of that, I'm the kind of person who takes things apart just to see if I can put them back together again—so far, a couple of old MacBook Pros, an HP Legion, an Apple Magic Mouse, and a pair of speakers have all lived to tell the tale. I fence, chase a frisbee, hit volleyballs and birdies around, and drink more boba tea than is probably good for me.",
      headshotAlt: "Ethan Luh",
    },
    contact: {
      heading: "Contact",
      body: "I'm looking for Summer 2027 software engineering internships — especially anywhere the work sits on top of real math. If my projects fit what you're hiring for, or you want to compare notes on zero forcing, my inbox is open.",
      ctaEmail: "Email ethan@ethanluh.com",
      ctaResume: "View résumé",
      elsewhere: "Elsewhere:",
    },
  },

  coursework: {
    meta: {
      title: "Coursework — Ethan Luh",
      description: "Coursework for Ethan Luh, CS/Math/Stats student at Penn State Behrend.",
    },
    heading: "Coursework",
    systemsSoftware: {
      title: "Systems & Software",
      tag: "coursework",
      description:
        "Data Structures & Algorithms, Computer Organization/Architecture, Operating Systems, Programming Languages, Computer Networks.",
    },
    aiSecurity: {
      title: "AI & Security",
      tag: "coursework",
      description: "Artificial Intelligence, Computer Vision, Cryptography, Machine Learning + Data Science.",
    },
    mathStats: {
      title: "Math & Statistics",
      tag: "coursework",
      description:
        "Discrete Mathematics, Calculus I–III, Linear Algebra, Differential Equations, Statistics I & II, Number Theory, Numerical Analysis.",
    },
  },

  howItWorks: {
    meta: {
      title: "How This Site Works — Ethan Luh",
      description: "Notes on the math and geometry driving this site: zero forcing, convex hull peeling, and Delaunay triangulation.",
    },
    heading: "How This Site Works",
    intro:
      "Notes on the math driving the layout and animation of this site — not a project write-up, just what's actually running under the hood.",
    railLabel: {
      zeroForcing: "Zero forcing",
      workOrdering: "Work ordering",
      delaunay: "Delaunay",
    },
    zeroForcing: {
      title: "Zero Forcing",
      stat: "{{seedCount}} seed{{seedPlural}} · {{nodeCount}} nodes",
      definition:
        "<strong>Zero forcing.</strong> A colored vertex with exactly one uncolored neighbor forces that neighbor to color; a zero forcing set is a starting coloring that, applying this rule repeatedly, colors the whole graph.",
      remark:
        'The hero graph is this site\'s actual content — the same {{nodeCount}} items, connected by the same Delaunay edges used for "related." The {{seedCount}} moss-colored seeds on load are a real computed minimum zero forcing set, not a hand-picked example; everything else propagates in the order the rule actually forces it. Hover a node for its title, click to visit.',
    },
    workOrdering: {
      title: "Convex Hull Peeling",
      stat: "{{layerCount}} layer{{layerPlural}} · {{itemCount}} items",
      body: "Work on the homepage isn't grouped by type (research/project/experience) — it's ordered by convex-hull peel layer over (recency, depth). The Featured card is the top of layer 0, the Pareto-extreme set not dominated on both axes by any other single item; everything else follows in layer order, labeled with its kind and layer number.",
    },
    delaunay: {
      title: "Delaunay Triangulation",
      stat: "{{pointCount}} points{{belowThreshold}}",
      definition:
        "<strong>Delaunay triangulation.</strong> Given a set of points, the triangulation where no point lies inside another point's circumcircle — the one that avoids thin, needle-like triangles.",
      remark:
        'The small node-and-edge diagram next to each "related" list is the actual triangulation over hand-placed (topic, recency) coordinates — every point and edge in the full graph, with the current card\'s node and its neighbors highlighted. Below {{minPoints}} points the triangulation gets arbitrary, so the feature stays off until there\'s enough content to make it mean something.',
    },
  },

  stack: {
    meta: {
      title: "Stack — Ethan Luh",
      description: "The languages, frameworks, and math that the research, projects, and experience above actually run on.",
    },
    heading: "Stack",
    intro:
      "What actually ships in the work above, split into what it's built with and what it's built on — a fuller picture than the one-line summary under Work.",
    railLabel: {
      tech: "Tech stack",
      math: "Math stack",
    },
    techHeading: "Tech Stack",
    mathHeading: "Math Stack",
    tech: {
      languages: { label: "Languages", items: "Python · TypeScript · C++" },
      mlVision: { label: "ML & Computer Vision", items: "PyTorch · YOLOv8 · ONNX Runtime" },
      site: { label: "This Site", items: "Astro · Tailwind CSS" },
    },
    math: {
      graphTheory: {
        label: "Graph Theory",
        items:
          "Zero forcing · Graph Laplacian diffusion · Similarity graphs & connected components · Conflict graphs & graph coloring · Spectral graph theory",
      },
      geometry: {
        label: "Combinatorics & Discrete Geometry",
        items:
          "Ehrhart theory · Polytopes & lattice points · Convex hull peeling · Delaunay triangulation · Simplicial complexes",
      },
      statistics: {
        label: "Statistics & Probability",
        items: "Quantile regression · Bayesian conjugate priors (Beta-Binomial, Normal-Normal) · Ranking fusion (NDCG@10)",
      },
    },
  },

  research: {
    zeroForcingPolytopesResearch: {
      title: "Zero Forcing Polytopes",
      status: "in progress",
      abstract:
        "Grew out of sitting in on an undergraduate thesis defense on the minimal forts of trees, then reading the foundational paper behind it independently. Now an independent study applying Ehrhart theory to zero forcing polytopes on small graph families — foundational reading done, approach identified, write-up in progress.",
      impact:
        "Independent study applying Ehrhart theory to zero forcing polytopes — approach identified, write-up in progress.",
      notesLinkLabel: "ask about this",
    },
  },

  projects: {
    zeroForcingPolytopes: {
      title: "zero-forcing-polytopes toolkit",
      tag: "python",
      description:
        "Computational companion to the zero forcing polytopes research above: construct the polytope from a graph's minimum forcing sets and enumerate its lattice points, pruning the search rather than brute-forcing it, since forcing-set enumeration blows up combinatorially past small graphs. In progress.",
      impact:
        "Makes forcing-polytope lattice-point counts computable where brute-force enumeration blows up.",
      techStack: "Python",
      mathStack: "Zero forcing · Ehrhart theory · Polytopes & lattice points · Combinatorics",
    },
    preferenceLayer: {
      title: "preference-layer",
      tag: "python · bayesian ranking",
      description:
        "Portable preference infrastructure and API for the agentic web — user-controlled preference credentials (Ed25519-signed, W3C Verifiable-Credentials-style, selectively disclosable) and profile-conditioned product intelligence for AI shopping agents. Preferences live in a sparse directed acyclic graph rather than flat embeddings, so hierarchical structure (laptop preferences → headphone preferences) supports transfer learning across product categories. A quality-intelligence layer extracts profile-conditioned signals from unstructured review text via TF-IDF/softmax scoring, then aggregates the noisy per-review signals with Beta-Binomial and Normal-Normal conjugate-prior Bayesian shrinkage; final ranking blends preference and quality scores through a tunable α-blend fusion function, evaluated against NDCG@10.",
      impact:
        "Portable, cryptographically signed preference profiles that AI shopping agents can actually rank against.",
      imageAlt:
        "Architecture diagram: signed preference credentials feed a DAG preference graph and Bayesian quality scoring into a blended product ranking.",
      techStack: "Python",
      mathStack: "Bayesian conjugate priors (Beta-Binomial, Normal-Normal) · TF-IDF & softmax scoring · DAG-structured preference graphs · Ranking fusion (NDCG@10)",
    },
    quire: {
      title: "quire",
      tag: "typescript · graph theory",
      description:
        "Direction-triage tool for AI-generated PR swarms — groups PRs pursuing the same product direction into a bundle, so a human makes one accept/defer/reject decision per bundle instead of per PR. Bundling runs connected-components clustering over a similarity graph (PRs as nodes, cosine similarity between effect-summaries as edges); a drift-detection system keeps each bundle's stated direction honest to what the PRs inside it actually do. A conflict graph over file-overlap between queued bundles drives merge-queue scheduling, with exploratory work extending symbol-coherence checks to simplicial complexes and bundle-cohesion metrics to spectral graph theory (Fiedler value).",
      impact:
        "Live at quire-review.com — collapses a swarm of AI-generated PRs into a handful of accept/defer/reject decisions.",
      imageAlt:
        "Diagram of quire's pipeline: pull requests clustered into bundles via a similarity graph, then scheduled through a file-conflict graph.",
      techStack: "TypeScript",
      mathStack: "Similarity graphs & connected components · Conflict graphs & graph coloring · Simplicial complexes · Spectral graph theory",
    },
    marketSentimentPredictor: {
      title: "market-sentiment-predictor",
      tag: "python · graph diffusion",
      description:
        "Models how a signal (an SEC filing, a press release) propagates through the market's information hierarchy — SEC filings → institutional investors → financial media → retail — as a continuous-time heat kernel on the graph Laplacian, then feeds the diffusion lag into quantile-regression models predicting P10/P50/P90 forward returns at three horizons (1-hour, 1-day, 5-day).",
      impact:
        "Forecasts P10/P50/P90 forward returns from how a filing physically diffuses through the market's information graph.",
      imageAlt:
        "Diagram of a signal diffusing from SEC filings through institutions and media to retail, feeding quantile-regression return forecasts.",
      techStack: "Python",
      mathStack: "Graph Laplacian diffusion · Quantile regression",
    },
  },

  experience: {
    agentmadeInternship: {
      role: "Software Engineering Intern",
      org: "AgentMade",
      description:
        "Built and open-sourced Quire (see Projects), a triage tool for AI-generated pull requests, and an internal changelog manager. Worked across the frontend of the full application, and researched ways to improve the team's internal use of agent loops and fleets—work that fed into improving how agents are used in the product itself.",
      impact: "Shipped and open-sourced quire during a production internship.",
    },
    uasSoftwareLead: {
      role: "Software Team Lead",
      org: "UAS Club, Penn State Behrend",
      description:
        "Leads a 10-person software team building Behrend_UAS, a CI-tested drone pipeline — a YOLOv8 model trained on Blender-synthesized data detects mannequins and tents, and a Python perception-control node plus a low-latency C++ ONNX runtime turn detections into autonomous flight guidance, backed by a simulation harness and full documentation.",
      impact: "Leads 10 engineers shipping a CI-tested YOLOv8 + C++ ONNX drone autonomy pipeline.",
    },
  },

  contentPoints: {
    zeroForcingPolytopesResearch: { label: "Zero Forcing Polytopes (research)" },
    zeroForcingPolytopes: { label: "zero-forcing-polytopes toolkit" },
    preferenceLayer: { label: "preference-layer" },
    quire: { label: "quire" },
    marketSentimentPredictor: { label: "market-sentiment-predictor" },
    agentmadeInternship: { label: "Software Engineering Intern, AgentMade" },
    uasSoftwareLead: { label: "Software Team Lead, UAS Club" },
    systemsSoftware: { label: "Systems & Software (coursework)" },
    aiSecurity: { label: "AI & Security (coursework)" },
    mathStats: { label: "Math & Statistics (coursework)" },
  },
} as const;

export default COPY;
