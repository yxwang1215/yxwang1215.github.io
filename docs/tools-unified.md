# Unified PaperScan

Canonical UI: `/tools/`. The old `/tools/png-to-pdf/` page redirects there; the directory remains an asset namespace, not a second app. Root imports the enhanced scanner, so JPEG is accepted at the actual public entry.

## One-click scanning

Seven modes: Auto, White document, Black-and-white scan, Soft gray, Faithful color, Photo enhancement, Original. Import analysis uses luminance quantiles and neutral-color fraction, not a fixed manual contrast. Mode thumbnails are rendered from the user's image. Applying a mode to all pages computes settings from each page's statistics. Preview and export use the same selected settings. Advanced sliders and advanced export settings are collapsed by default.

## Compression

One in-page tab handles PNG, JPEG, WebP and PDF. It does not upload file bytes. Runtime dependencies, including MIT-licensed PDF-LIB 1.17.1, are served from this site's own assets. The codec npm archive is SHA-512 verified by scripts/vendor-tools.py.

PNG lossless: validate chunk CRC, bounded zlib decode, reverse row filters, choose row filters by residual cost, DEFLATE and rebuild IDAT while preserving other chunks, raw samples and alpha. Static grayscale/indexed/RGB/RGBA and valid bit depths are supported; Adam7 is returned unchanged; APNG is rejected. Lossy PNG reduces RGB precision (6 or 5 bits per channel mapped into an 8-bit output) and may resize; alpha retained but source metadata is not retained.

JPEG/WebP balanced or small: canvas encoder quality .84 or .65 plus longest-side bounds 3200/1800 and a 12 MP processing limit. Lossless profile returns original JPEG/WebP instead of falsely claiming lossless re-encoding.

PDF: PDF-LIB object-stream serialization preserves existing text/vector/OCR objects. Balanced/small profiles additionally recompress compatible 8-bit DeviceRGB/DeviceGray DCTDecode or plain FlateDecode image streams. Images with masks, Decode, DecodeParms, alternate representations or unsupported codecs/colorspaces are skipped. No page rasterization. Encrypted, signed/signature-field and XFA documents are rejected. Not a PDF/A compliance tool. Some PDFs will not shrink.

For all formats, if a candidate is not smaller the original is returned; UI reports that truthfully. File results remain separately downloadable or can be collected into a STORE ZIP. Source files are unchanged. Cancellation stops pending work and never emits incomplete files; completed results remain available.

Limits: compression 20 files, 50 MiB each, 150 MiB total; PDF 1–300 pages; PNG 16 MP/16384 px side/128 MB inflated data. JPEG decode still temporarily uses the original image's memory, so use smaller batches on mobile.

## Verification commands

`node --test tests/scanner-core.test.mjs tests/modes.test.mjs tests/compression.test.mjs`

`python tests/unified-e2e.py` starts an HTTP server and tests the actual root page, modules and workers in Chromium. It generates fixtures and verifies output using Pillow, PyMuPDF and ZIP CRC checks. The CI workflow runs this before committing generated UI sources. Local restricted-browser checks use a separate offline harness and are not a substitute for the HTTP-based CI run.
