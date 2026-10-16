# Tools editor implementation and verification

The approved light canvas-first editor is implemented at `/tools/#image` and `/tools/#pdf`. Image/PDF sessions persist across tab switches. Reused the existing image engine, image-dependent seven scan modes, PNG/JPEG/WebP/PDF original-file compressors, local pdf-lib and all seven legacy routes.

## Verified
- 66 core/state/codec/legacy-route regression tests passed in GitHub Actions.
- 33 real HTTP Chromium checks passed: actual imports; worker processing; preset pixels and undo; comparison; crop/rotation; JPG/PNG/WebP/ZIP/PDF downloads; PDF selection, searchable text and rotation preservation; split ZIP; original PDF optimization; explicit raster compression; cross-workspace handoff; mobile viewport and drawer.
- No page runtime errors during those checks. Screenshots and exported fixtures are retained in the Actions artifacts.
- Separate local in-memory CPU-fallback checks passed; these were not substituted for normal HTTP/module/worker tests.

The integration verification succeeded in Actions run 38848941542. One earlier integration run passed application tests but its contents-only token could not change a workflow. Workflow changes were therefore handled separately with the repository connector. One-time integration scaffolding is removed from the final tree.

## Release checks
Regular PR checks run against the checked-in source without executing the old one-time migration. On main, the editor workflow additionally checks the public Pages HTML and module bytes against the checkout. Publication is only reported after that check or equivalent live verification succeeds.

## Boundaries
No OCR, HEIC or automatic perspective-correction claims. PDF structural editing does not intentionally rasterize searchable text, but document-level forms/signatures/bookmarks may not survive page assembly. Original-file compression is clearly separated from edited-output export. Mobile testing uses an emulated Chromium viewport; Safari and physical devices are not covered.
