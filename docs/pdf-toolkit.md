# Personal PDF toolkit

The Tools landing page is `/tools/`. The existing PaperScan implementation at `/tools/png-to-pdf/` is unchanged. The old root PNG converter is preserved at `/tools/png-to-pdf-simple/`, referencing its original JS/CSS in the parent folder.

## New routes
- `/tools/mixed-to-pdf/`: mix PNG images and PDF page ranges in file order. Repeating a PDF with different ranges allows interleaving an image between its pages.
- `/tools/merge-pdf/`: merge PDFs with per-file page selection, ordering and rotation.
- `/tools/split-pdf/`: each page, fixed-size chunks, or semicolon-delimited groups (`1-3;4-6;7,9`). Multiple outputs are downloaded as a ZIP.
- `/tools/extract-pdf/`: select pages with comma/range syntax; reverse ranges and duplicate pages are supported.
- `/tools/organize-pdf/`: reorder, exclude and rotate numbered page cards. Cards deliberately display page numbers and dimensions, not rendered content previews; the original local document can be opened separately.

## Implementation
Four shared application assets plus self-hosted pdf-lib 1.17.1 under `tools/pdf-kit/`. The library distribution, MIT license and SHA256 manifest are committed. No runtime CDN, external fonts, analytics, server API or package build is required. The Jekyll site copies the standalone pages and assets unchanged. `docs/scripts/build-pdf-toolkit-pages.py` regenerates the landing and workbench HTML and preserves the original simple converter on its first run. Tests must be run after generator changes.

All parsing and output processing run in a dedicated Web Worker. Cancellation terminates that worker while retaining original File references; retry starts a fresh worker. Original inputs are never modified. Blob URLs are revoked when removed, cleared, replaced, or the page is closed. Inputs are not stored persistently or transmitted. CSP permits only same-origin static scripts and workers and prohibits network connections. The website itself is still served by GitHub Pages.

PDF page copying preserves page streams, searchable text, vector graphics, images, CropBox and rotation without rasterizing. Document-level bookmarks, attachments, metadata and cross-document links are not guaranteed to survive. Interactive forms, XFA and signature fields are rejected; encrypted documents are rejected rather than ignoring encryption. Flatten or print those documents to ordinary PDFs in trusted software first. This is not an OCR, signature-validation or PDF sanitization tool.

## Limits
50 input files; 50 MiB per PDF; 25 MiB per PNG; 150 MiB combined input; 500 total input and output pages; 200 MiB combined output including ZIP overhead. PNG uses the existing 16-million-pixel and 16384-pixel-side limits; APNG is rejected. Conversions have a two-minute worker timeout. Memory use varies with document complexity: use smaller batches on mobile. Refreshing the page discards pending work.

## Verification commands
```
node --test tests/pdf-toolkit.test.cjs tests/toolkit-routes.test.cjs tests/png-pdf.test.cjs tests/scanner-core.test.mjs
python -m pip install playwright==1.55.0 PyMuPDF==1.26.4 Pillow==11.3.0
python -m playwright install --with-deps chromium
python tests/pdf-toolkit-e2e.py
```

The browser suite serves the actual files over HTTP, uses real CSP and worker imports, downloads PDFs and ZIPs, and verifies output text, page order, rotation, crop, alpha, rendered-page equality, Unicode filenames, invalid inputs, cancellation/retry and mobile layout. It also checks that requests are same-origin static GETs only. `OFFLINE_HARNESS=1` is a reduced source-injection fallback for navigation-restricted environments and does not verify HTTP or CSP; do not conflate that result with the normal CI mode. Safari/iOS and Firefox are not covered by this suite.
