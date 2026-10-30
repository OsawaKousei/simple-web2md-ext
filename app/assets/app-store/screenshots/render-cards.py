#!/usr/bin/env python3
"""Render annotated Mac images using the existing brand renderer and real capture."""

import base64
import mimetypes
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / "creative"))
from render import render


if __name__ == "__main__":
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    for filename in ["mac-01-markdown-ja.svg", "mac-02-how-to-ja.svg"]:
        source = ET.parse(ROOT / filename).getroot()
        # Embed local image references in memory so librsvg needs no network or base URI.
        for image in source.iter("{http://www.w3.org/2000/svg}image"):
            path = (ROOT / image.attrib["href"]).resolve()
            mime = mimetypes.guess_type(path.name)[0]
            image.set("href", f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode())
        render(ET.tostring(source), ROOT / filename.replace(".svg", ".png"), 2560, 1600)
