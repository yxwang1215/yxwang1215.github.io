# Test Lab v2 — personality and readable UI

## Scope
Add two independent personality questionnaires, redesign the Test catalogue and restyle the existing Talent Atlas introduction, questions and report. Existing Talent Atlas item IDs, answers, scoring and localStorage keys are unchanged. No changes to the homepage or Tools styling.

## Personality inventories

**Big Five:** the public-domain 50-item IPIP Big-Five Factor Markers, in the official sample order and with the published positive/negative keys. English source: https://ipip.ori.org/New_IPIP-50-item-scale.htm . Key: https://ipip.ori.org/newBigFive5broadKey.htm . Permissions: https://ipip.ori.org/ . Chinese text is our translation; its reliability and validity have not been independently established. The five dimensions are Extraversion, Agreeableness, Conscientiousness, Emotional Stability, and Intellect/Imagination. The last dimension is not an intelligence measure. No normative claims or aggregate personality score.

**Personality Compass:** 64 original bilingual items. The first 32 cover E/I, S/N, T/F and J/P preferences, with eight balanced-keyed items per dimension. The remaining 32 separately inform learning, working, relationship and communication suggestions. Framework background: https://www.myersbriggs.org/my-mbti-personality-type/the-mbti-preferences/ . This is NOT the official MBTI instrument, and has no psychometric validation or organizational endorsement. Type names and descriptions are original. A middle-range response (43–57) produces X, not an arbitrarily forced letter.

Each dimension is the mean of keyed 1–5 answers, linearly rescaled as `(mean - 1) * 25`. Display bands below 40 and above 60 are UI heuristics, NOT population norms. Scores are not percentiles, aptitude ratings, clinical diagnoses, hiring indicators or predictions. All-neutral responses remain 50 and Compass displays XXXX. Context scores never change the four-letter summary.

## UI and privacy
Use existing local Nunito Sans Latin fonts and platform Chinese sans-serif fonts. Body text is 18–20px, questions 20–21px, desktop options 16px, mobile options 14px with large hit areas; primary buttons are at least 50px high. Styles are scoped to Test pages. Support keyboard radio groups, live progress, visible focus, reduced motion, responsive layouts and print styles.

Independent versioned localStorage keys, strict restore validation, incomplete-answer gates and visible storage-unavailable feedback. No questionnaire endpoint, third-party assessment dependency, answer uploads, raw-answer export or result-bearing URLs. Site-wide analytics, if enabled separately, may still log visits. JSON exports contain aggregates only. Existing Talent Atlas data remains intact.

## Verification
Node tests cover item counts, published key directions, reverse scoring, neutral/endpoint responses, all 16 clear type combinations, ambiguous types, context independence, corrupt/inherited/missing answers, storage-version isolation, catalogue routes and typography.

Browser checks run against the Jekyll-built site: real label interaction, blocked next buttons, previous/edit, reload and resume, English item display, complete 50/64/48/72-item flows, aggregate JSON downloads, print visibility, catalogue filters, no answer submissions, and 1440/390/320px layouts. Known pre-existing global `MathJax is not defined` errors are counted separately; any other page error fails the check. The test does not disable or weaken existing repository checks.
