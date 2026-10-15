# PNG to PDF at /tools/

Standalone static tool for the existing personal homepage. Runtime files: tools/index.html, tools/tools.css, tools/pdf-engine.js, tools/app.js. No package install, build step, CDN, remote font, analytics, or server API is needed. The existing Jekyll build copies these files unchanged. The navigation change only adds Tools and preserves every previous entry.

## Features
PNG file picker, drag/drop, screenshot paste, thumbnail queue, numeric filename sorting, reorder/rotate/remove controls, A4/Letter/image-sized pages, per-page automatic orientation, margins, 96/150/300 DPI for image-sized pages, lossless browser-decoded pixels or compact JPEG, direct download, progress, cancellation, and mobile layout.

The PDF 1.4 writer uses byte-counted objects/xref offsets, RGB image XObjects, native DEFLATE compression, and optional grayscale soft masks. If CompressionStream is unavailable, it uses uncompressed image streams. Original PNG metadata and 16-bit color are not preserved: Canvas provides decoded 8-bit pixels. Compact mode uses a maximum 2400 px long edge, JPEG quality 0.85, and a white background. No OCR or editable text is produced.

## Limits and privacy
50 images; 25 MiB per image; 100 MiB total input; 16 million pixels and 16384 px maximum side per image; 200 MiB output. APNG is rejected. Files remain in memory and are not persisted or transmitted. Object URLs are revoked on removal/reset/replacement. Imports and exports lock mutations. The tool's CSP disallows network connections and external scripts. GitHub Pages still serves the webpage itself.

## Verification
Run `node --test tests/png-pdf.test.cjs` with Node 22 or newer: 10 passing core tests.

The authored HTML/CSS/JS were also exercised in local Chromium using Playwright, with real PNG fixtures and real PDF downloads inspected by PyMuPDF: 26 passing browser/PDF checks, covering queue order, page geometry, automatic orientation, alpha, lossless pixel dimensions, numeric sort, rotation, JPEG downsampling, invalid files, grayscale PNG, Unicode filenames, cancellation, inert filenames, no HTTP requests during conversion, and 390 px responsive layout. Screenshots and PDF renders were visually inspected.

Test environment caveat: URL navigation was restricted in the build sandbox, so Playwright loaded the exact authored source into a blank document rather than navigating to localhost. This tests behavior and layout, not GitHub delivery or live resource headers. Real Safari/iOS and Firefox were not tested. Publication/build status must be checked separately.
