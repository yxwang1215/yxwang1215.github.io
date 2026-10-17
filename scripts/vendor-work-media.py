#!/usr/bin/env python3
"""Vendor verified figures from the author's papers. Requires Pillow==11.3.0."""
from __future__ import annotations
import hashlib
import io
import json
from pathlib import Path
import time
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MAX_BYTES = 12 * 1024 * 1024


def download(url: str) -> bytes:
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={"User-Agent": "Yuxuan-Wang-Publication-Media/1.0"}), timeout=60) as response:
                data = response.read(MAX_BYTES + 1)
            if len(data) > MAX_BYTES:
                raise ValueError(f"Oversized source: {url}")
            return data
        except (OSError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("Download exhausted")


def main() -> None:
    entries = json.loads((ROOT / "scripts/work-media-sources.json").read_text())
    output_dir = ROOT / "images/works"
    output_dir.mkdir(parents=True, exist_ok=True)
    notes = ["# Work illustrations", "", "Figures from the author's published papers and official project repositories.", "Local copies avoid third-party image requests on the homepage. Raster images are resized without cropping.", "Original authors and publishers retain rights to the figures; the website's MIT license does not relicense these assets.", ""]
    for entry in entries:
        data = download(entry["source"])
        if hashlib.sha256(data).hexdigest() != entry["sha256"]:
            raise ValueError(f"Source integrity mismatch: {entry['name']}")
        target = (ROOT / entry["output"]).resolve()
        if target.parent != output_dir.resolve():
            raise ValueError("Output must be directly inside images/works")
        if target.suffix == ".svg":
            svg = ET.fromstring(data)
            if not svg.tag.endswith("svg"):
                raise ValueError("Invalid SVG")
            if any(el.tag.split("}")[-1] in {"script", "foreignObject"} for el in svg.iter()):
                raise ValueError("Active SVG content is not permitted")
            target.write_bytes(data)
        else:
            bounds = (entry.get("max_width", 1000), entry.get("max_height", 700))
            if any(not isinstance(n, int) or not 1 <= n <= 2400 for n in bounds):
                raise ValueError("Image bounds must be integers between 1 and 2400")
            with Image.open(io.BytesIO(data)) as image:
                image.load()
                image.thumbnail(bounds, Image.Resampling.LANCZOS)
                if image.mode not in ("RGB", "RGBA"):
                    image = image.convert("RGB")
                image.save(target, "WEBP", quality=88, method=6)
        print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes")
        label = entry.get("figure", target.name)
        notes.append(f"- {target.name} — {label}: {entry['source']}")
    notes.extend(["", "Regenerate with `python scripts/vendor-work-media.py` after installing the pinned Pillow version.", "Source hashes and revision-pinned URLs are recorded in scripts/work-media-sources.json.", ""])
    (output_dir / "README.md").write_text("\n".join(notes))


if __name__ == "__main__":
    main()
