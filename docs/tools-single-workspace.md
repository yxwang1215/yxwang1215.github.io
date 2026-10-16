# Single-document Paper Studio

All interactive image and PDF tools now run inside `/tools/`. Hash routes select a workspace and contextual panel; they never reload the document or clear its file queues.

## Routes
- Image editor: `#image`; crop: `#image/crop`; compression: `#image/compress`.
- Edited image-to-PDF: `#image/pdf`; original lossless PNG/image-to-PDF: `#image/png-to-pdf`.
- PDF editor: `#pdf`; merge: `#pdf/merge`; mixed images/PDF: `#pdf/mixed`; organize: `#pdf/organize`.
- Split: `#pdf/split`; extract: `#pdf/extract`; compress: `#pdf/compress`; image handoff: `#pdf/images`.

Seven former standalone URLs now redirect to the matching hash. Their independent DOM contracts have been replaced by a shared-workspace integration test, while existing image/PDF codec unit tests are retained.

Original-image PDF export uses the existing lossless RGBA writer. It preserves native image dimensions and transparency and intentionally ignores preview enhancement/crop/resize settings. Edited-image export remains separate. Mixed PDF pages use the current shared PDF source/page model. Extraction supports explicit order and duplicate pages; splitting supports each page, fixed-size chunks and custom/reverse ranges.

`studio-comfort.css` makes surrounding controls readable without browser zoom: desktop descriptions/form labels/buttons 16px, inspector headings 22px, inputs 46px and primary buttons 48px. Panels and mobile drawers expand with the text. Image zoom/pan remains independent of output dimensions.

## Verification
Preflight workflow 38856877307 passed the core suite, actual-HTTP integrated document/layout tests, the existing zoom/export/compression browser suite and the 18-mode scanner suite. Artifacts include real exported PDFs/ZIPs and screenshots. Final PR and post-deploy checks validate the checked-in source, production hashes, old-link redirects, public-domain exports and responsive layout again.

Mobile coverage is emulated Chromium at 320/390px and tablet widths, not physical iOS/Safari. Existing memory/page guards remain; this release does not introduce OCR or server-side processing.
