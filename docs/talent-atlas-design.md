# Talent Atlas — Design Notes (v1.0)

## Status

Talent Atlas is an **original, exploratory self-report assessment** for self-reflection, not a psychometrically validated aptitude test. It does not assess intelligence, objectively measured skill, clinical traits, educational suitability, or hiring potential.

Website routes:

- Catalogue: \`/tests/\`
- Assessment: \`/tests/talent/\`

Code is split into independently reusable modules:

- \`_data/tests.yml\`: catalogue entries for current/future tests
- \`assets/js/talent-atlas-data.js\`: item bank and domain metadata
- \`assets/js/talent-atlas-core.js\`: deterministic selection, reverse scoring and scoring
- \`assets/js/talent-atlas-app.js\`: browser interactions, storage and report
- \`assets/css/test-lab.css\`: responsive styles

## Construct and item design

Eight exploratory **strength directions** (not established latent factors):

1. Analytical reasoning / 分析推理
2. Learning & exploration / 探索学习
3. Creative ideation / 创意构想
4. Hands-on building / 实践构建
5. Empathy & collaboration / 共情协作
6. Communication & expression / 表达沟通
7. Initiative & influence / 领导推动
8. Planning & execution / 规划执行

Every direction is measured via three distinct **self-report signals**:

- **Motivation / 兴趣驱动**: preference and willingness to engage.
- **Perceived ease / 自然上手**: subjective ease, not objective aptitude.
- **Recent practice / 近期实践**: self-reported behavior during the last six months, not external performance evidence.

There are three original bilingual items for each direction/signal (8 × 3 × 3 = 72). Quick mode uses the first two items per direction/signal (48). One perceived-ease item per domain is reverse-keyed, and all items use a 1–5 agreement scale. Question order is deterministic but interleaved across domains/facets; there are no copyrighted questionnaires embedded.

### Scoring

An item's effective value is \`6 − response\` for reverse-keyed items; otherwise the raw 1–5 response. Each domain/facet score is \`25 × (arithmetic mean − 1)\`, bounded in \`[0,100]\`. The exploratory composite is:

\`0.40 × motivation + 0.30 × perceived ease + 0.30 × recent practice\`.

These **weights are design choices, not validated factor loadings**. Scores are linear transformations of self-ratings, **not percentiles**, IQ, aptitude measures, predictive probabilities, norm-referenced comparisons, or diagnoses. Within-person rank differences smaller than a few points are not treated as meaningfully distinct.

The report presents:

- All eight composite scores and 3-facet breakdowns
- An eight-axis visualization
- Three small real-world experiments for the user's strongest reported directions
- A possible motivation/practice gap without interpreting it as lack of ability
- A gentle response-distribution caution when answers are nearly identical or frequently neutral
- JSON of aggregate domain scores, optional clipboard summary and browser print-to-PDF

### Privacy

Only browser \`localStorage\` is used for responses/progress. No assessment submission request or server-side response database is implemented. A user can clear storage using the on-page control or browser controls. JSON export intentionally excludes individual item responses. General website analytics can still log visits independently.

### Important limitations

Self-report is subject to recall bias, social desirability, item wording effects, response styles and limited opportunity to demonstrate abilities. The assessment has not been normed or validated in any population or language. Language equivalence, stability, internal consistency, factor structure, measurement invariance, convergent/discriminant validity and predictive utility are **unknown**.

In particular, the phrase *talent* is a user-facing metaphor for strengths to explore, not a claim of a biologically fixed trait. No test should be used for consequential educational, employment or clinical decisions without purpose-specific evidence.

### Proposed empirical validation roadmap

1. Conduct independent expert content reviews for coverage, ambiguity and face validity in both languages; run cognitive interviews.
2. Pilot with diverse participants using voluntary, privacy-respecting consent. Record completion times, missing responses, item variance, floor/ceiling effects and response-style patterns.
3. Estimate ordinal alpha/omega, item-total associations and test–retest stability (e.g., 2–4 weeks), reporting uncertainty intervals and checking differences by mode/language.
4. Test dimensionality and overlap using EFA followed by independent CFA; revise or merge non-discriminant dimensions. Check language and demographic measurement invariance before comparative claims.
5. Compare clearly matched constructs to licensed or public-domain instruments (e.g., established interest inventories, IPIP traits, validated strength measures) without copying copyrighted items. Validate against **external behavioral evidence** for any claim about aptitude or predictive usefulness.
6. Pre-register future calibration work and refrain from publishing population norms or predictions until appropriate validation supports their intended use.
7. Reassess weighting and content based on independent data and version the scoring method so earlier reports are not silently reinterpreted.

## Background reading (inspiration, not endorsement)

- O*NET Interest Profiler — https://www.onetcenter.org/reports/IP_Manual.html (Holland/RIASEC occupational interests; separate from objective skills)
- Gallup CliftonStrengths — https://www.gallup.com/cliftonstrengths/en/253715/cliftonstrengths-how-it-works.aspx (strength themes)
- VIA Institute — https://www.viacharacter.org/researchers/assessments/guidelines (character strengths; VIA item text is copyrighted and **not** reproduced)
- IPIP — https://ipip.ori.org/ (public-domain personality item pool; original item bank here is independently written)
- APA guidance — https://www.apa.org/practice/guidelines/psychological-evaluations.html (reliability and validity must fit the assessment purpose)

The original Talent Atlas item bank is not an O*NET, Gallup, VIA or IPIP instrument, and these organizations have not reviewed or endorsed it.
