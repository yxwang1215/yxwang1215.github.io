# Glance-ETD paper project page design

## Intent

Add a public project page for the supplied CVPR 2027 review PDF, “Glance, then Select: Evidence-Tempered Visual Token Selection for Extremely Compressed Multimodal LLMs.” The page should make the method legible before a visitor opens the paper, while preserving the existing personal site’s paper-project visual language.

## Scope

- Add `/papers/glance-etd/` with the title, anonymous review status, abstract, method explanation, key results, efficiency figures, and links to the local PDF and paper collection.
- Copy the paper’s overview, motivation, and efficiency PNG figures into `papers/assets/` with stable filenames.
- Add the PDF as `papers/assets/glance-etd-paper.pdf`.
- Add the project to the paper directory, homepage Works catalogue, and Research page under efficient multimodal AI.
- Add source-level contract checks for the new route, assets, page evidence, and navigation links.

## Out of scope

- No author names, affiliations, arXiv URL, or code URL are invented; the supplied PDF is an anonymous CVPR review copy.
- No new JavaScript interaction or external dependency is needed.
- No redesign of the existing paper-project CSS system.

## Implementation decisions

- Reuse `page_class: paper-project`, `assets/css/paper-project.css`, the existing breadcrumb/button/section patterns, and responsive behavior.
- Use `/papers/glance-etd/` as the stable route and `glance-etd` as the asset prefix.
- Lead with the two-stage story: the glance encoder reduces encoder cost; ETD combines max–min diversity with supervised evidence at a strict 5% visual-token budget.
- Surface the paper’s reported numbers as contextual results: 90.3±0.8% retention for Glance-ETD, 91.7% for dense + ETD, 84.2% for frozen ETD, 2.9× HR-Bench 4K prefill speed-up, 65 vs. 373 prefill TFLOPs, and DocVQA 74.5 vs. 52.5 for DivPrune.
- Keep captions and notes explicit that all figures and numbers come from the supplied review copy.

## Verification

Run `python3 tests/test_papers_pages.py`, build the Jekyll site with the repository’s existing command, and rerun the paper-page tests against `_site`. Confirm the new route and copied assets exist in the generated output.
