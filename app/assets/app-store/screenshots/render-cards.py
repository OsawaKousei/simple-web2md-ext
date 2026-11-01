#!/usr/bin/env python3
"""Render annotated store images using the brand renderer and real captures."""

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
    filenames = sys.argv[1:] or ["mac-01-markdown-ja.svg", "mac-02-how-to-ja.svg",
                                 "iphone-01-safari-ja-1206x2622.svg",
                                 "iphone-02-setup-ja-1206x2622.svg",
                                 "ipad-01-safari-ja-2064x2752.svg",
                                 "ipad-02-setup-ja-2064x2752.svg"]
    for filename in filenames:
        source = ET.parse(ROOT / filename).getroot()
        # Embed local image references in memory so librsvg needs no network or base URI.
        for image in source.iter("{http://www.w3.org/2000/svg}image"):
            path = (ROOT / image.attrib["href"]).resolve()
            mime = mimetypes.guess_type(path.name)[0]
            image.set("href", f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode())
        render(ET.tostring(source), ROOT / filename.replace(".svg", ".png"),
               int(source.attrib["width"]), int(source.attrib["height"]))
