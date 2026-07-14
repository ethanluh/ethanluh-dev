# Content audit — 2026-07-14

Audience: recruiters (technical + non-technical) and research contacts. Goal: highest-impact fix first. Narrative priority: zero forcing polytopes (main), drone perception (second), dev tools (third). Math-forward framing is fixed/non-negotiable.

Ranked by impact/effort, highest first.

## 1. Featured-slot mismatch (high impact / low effort)

The featured card isn't hand-picked — it's computed by convex-hull peeling over `(recency, effective depth)` in `src/pages/index.astro:76-83`, scored from `src/data/content-points.ts`. Unshipped work gets a 0.6x depth penalty (`shipped === false ? 0.6 : ...`).

Actual numbers: `zero-forcing-polytopes-research` scores (0.95 recency, 0.57 effective depth) and survives to Pareto layer 0, but `quire` wins the featured slot (0.85, 0.715) because the shipped-work 1.3x bonus pushes it past the unshipped research on the depth axis. The page's biggest visual moment currently goes to `quire`, not the stated main character.

Fix options:
- Lower the shipped-penalty weight so an unshipped-but-deep research item can outrank shipped side projects, or
- Decouple "featured slot" (algorithmic, recency/depth signal) from "narrative main character" (hero/about copy asserts priority explicitly) so the two systems aren't required to agree.

Leaning toward the first — the hero headline already lists polytopes first (`copy.ts:37`), so the featured card contradicting it reads as inconsistent to careful readers.

## 2. "Coming soon" / "not yet built" language undersells the top-priority work (medium impact / low effort)

`copy.ts:162` ("Planned independent study... not yet started") and `copy.ts:172` ("not yet built") describe the supposedly-highest-priority work. Non-technical recruiters parse "not yet started" as "nothing to show." Research-minded readers won't credit the actual signal present (foundational paper read, plan formed, Ehrhart-theory approach understood). Reframe away from construction-status wording toward what exists now (the plan, the reading, the direction); let "in progress" carry the temporal info.

## 3. About section buries the origin story (medium impact / low effort)

`copy.ts:62` (About paragraph 1) — the thesis-defense / independent-reading origin story — is the strongest research-credibility material on the site, but it sits at the bottom of the page after Work, three scrolls from the hero. If polytopes is the main character, this "why" should travel with the "what" (e.g. pull a sentence into the research abstract itself) rather than live in a separate, low-visibility section.

## 4. Numbering collision (low impact / low effort)

`zero-forcing-polytopes-research` (`src/content/research.ts:16`) and `zero-forcing-polytopes` (`src/content/projects.ts:22`) are both "no. 01" — separate tracks, not a bug, but two "01"s on the same page reads as a typo to careful readers. Consider global numbering across all work, or dropping numbers from unshipped entries.

## 5. Site-mechanics content competes with the research narrative (low-medium impact / structural, not a quick fix)

`/how-it-works` and the "how this site works" nav link foreground zero forcing / hull peeling / Delaunay as site mechanics — a legitimate technical-recruiter flex, but a second claim on attention that can pull weight away from the research framing for both audiences. Not proposing a fix here — just keep it clearly in the "supporting evidence of engineering skill" lane, not competing with polytopes as the main story.

## 6. Résumé/contact CTAs demoted on desktop, absent from primary nav (high impact if broken / low effort)

`src/components/Nav.astro:15-21` has no direct Résumé or Contact link in the desktop nav — referenced as living in a "SideRail"/"IndexRail" component that wasn't found at `src/components/SideRail.astro` during this audit. Confirm it renders and carries real visual weight on desktop; on mobile these CTAs are buried under the hamburger menu (`Nav.astro:82-85`). If the referenced component doesn't actually exist, this is a broken CTA, not just a placement question.
