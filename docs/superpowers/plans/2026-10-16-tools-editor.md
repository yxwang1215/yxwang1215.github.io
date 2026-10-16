# Tools editor release record

The user approved the light canvas-first editor and explicitly requested public deployment. The release uses `/tools/#image` and `/tools/#pdf` in one application, preserving separate in-memory sessions and cross-workspace transfers.

## Reconciliation
Retained all main-branch changes through 20c473b419877b553412c0cc72c9def9ddcdc02a, including navigation and compatibility-route updates. Preserved all 18 scan recipes by using the existing SCAN_MODES registry and grouped them in the inspector. Retained original-file compressors and all seven compatibility routes. The old tool-card assertion was replaced by exact compatibility-link and shared-workspace assertions; legacy export and security checks were not removed.

## Verification
Studio release preflight run 38851001947 passed: all core tests, 33 editor browser checks, 47 legacy-browser checks, and the full scan-gallery suite covering every mode, batch application, exports and mobile interaction. The new missing-gallery regression failed before reconciliation and passed afterward. A fresh local run against the artifact snapshot passed all 80 core tests.

Regular checks test the checked-in source without migration scripts. The main-branch editor check additionally compares the public HTML and module hashes with the checkout and exercises actual public-domain image processing, PNG export, PDF import/export, retained workspace state, and mobile layout. Public publication is reported only after those checks pass.

## Boundaries
Mobile checks use emulated Chromium viewports, not physical iOS/Safari devices. No OCR, HEIC or automatic perspective-correction claims. Explicit raster compression loses searchable text. Ordinary PDF page copying may lose document-level signatures, forms or bookmarks. Original-file compression is separate from exporting current edits. No independent human code review was performed; automated regression and source inspection were used.
