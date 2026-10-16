# Unified tools editor

Approved in conversation: a neutral light editor inspired by shadcn/ui component proportions, Squoosh's image preview and Stirling-PDF's page workspace.

`/tools/` is one application, with `#image` and `#pdf` workspaces that retain files when switching. Use a compact header, narrow tool rail, central preview, contextual inspector and image filmstrip. The mobile inspector becomes a bottom drawer.

Reuse the unchanged PaperScan pixel engine and worker. Use actual current-image preset thumbnails. Keep advanced controls collapsed, preserve original files, and provide undo/redo and real exports. PDF structural operations preserve page text/vector content; optional raster compression must explicitly disclose loss of searchability, forms and links. Libraries may be downloaded but no file content is uploaded. No OCR, HEIC or automatic perspective correction claims.

Preserve the PDF-kit modules and legacy converters recently merged into main. Limit this release to the unified entry and its new assets, with no unrelated homepage/navigation edits.

Verification: range/history tests; actual image and document downloads; responsive desktop/mobile screenshots; PDF import/extract/rotate/split/rasterize/handoff integration; Jekyll and deployment checks. Local in-memory browser checks are distinct from HTTP/module/worker checks run in CI.
