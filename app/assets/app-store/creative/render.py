#!/usr/bin/env python3
"""Rasterize the editable SVG using librsvg + Cairo (no browser or network)."""

import ctypes as c
import ctypes.util
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent


class Rectangle(c.Structure):
    _fields_ = [(name, c.c_double) for name in ["x", "y", "width", "height"]]


def library(name):
    path = ctypes.util.find_library(name)
    if not path:
        raise RuntimeError(f"Install {name} to render SVGs, or export header-ja.svg in an SVG editor")
    return c.CDLL(path)


def render(svg, output, width, height):
    rsvg, cairo, objects = library("rsvg-2"), library("cairo"), library("gobject-2.0")
    rsvg.rsvg_handle_new_from_data.argtypes = [c.c_char_p, c.c_size_t, c.POINTER(c.c_void_p)]
    rsvg.rsvg_handle_new_from_data.restype = c.c_void_p
    rsvg.rsvg_handle_render_document.argtypes = [c.c_void_p, c.c_void_p, c.POINTER(Rectangle), c.POINTER(c.c_void_p)]
    rsvg.rsvg_handle_render_document.restype = c.c_int
    cairo.cairo_image_surface_create.argtypes = [c.c_int, c.c_int, c.c_int]
    cairo.cairo_image_surface_create.restype = c.c_void_p
    cairo.cairo_create.argtypes = [c.c_void_p]
    cairo.cairo_create.restype = c.c_void_p
    cairo.cairo_surface_write_to_png.argtypes = [c.c_void_p, c.c_char_p]
    cairo.cairo_surface_write_to_png.restype = c.c_int
    cairo.cairo_destroy.argtypes = [c.c_void_p]
    cairo.cairo_surface_destroy.argtypes = [c.c_void_p]
    objects.g_object_unref.argtypes = [c.c_void_p]
    error = c.c_void_p()
    handle = rsvg.rsvg_handle_new_from_data(svg, len(svg), c.byref(error))
    if not handle:
        raise RuntimeError("Unable to parse SVG")
    # CAIRO_FORMAT_RGB24: PNGs have no alpha channel, as required by App Store Connect.
    surface = cairo.cairo_image_surface_create(1, width, height)
    context = cairo.cairo_create(surface)
    try:
        viewport = Rectangle(0, 0, width, height)
        if not rsvg.rsvg_handle_render_document(handle, context, c.byref(viewport), c.byref(error)):
            raise RuntimeError("SVG rendering failed")
        if cairo.cairo_surface_write_to_png(surface, str(output).encode()) != 0:
            raise RuntimeError("PNG export failed")
    finally:
        cairo.cairo_destroy(context)
        cairo.cairo_surface_destroy(surface)
        objects.g_object_unref(handle)
    print(f"Created {output.name}: {width} × {height}, RGB")


if __name__ == "__main__":
    source = (ROOT / "header-ja.svg").read_bytes()
    render(source, ROOT / "header-ja-3840x1646.png", 3840, 1646)
    # Keep the artwork centered and extend its background for the universal placement.
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    universal = ET.fromstring(source)
    universal.set("width", "5244")
    universal.set("height", "2950")
    logical_height = 1920 * 2950 / 5244
    universal.set("viewBox", f"0 {(823 - logical_height) / 2} 1920 {logical_height}")
    render(ET.tostring(universal), ROOT / "universal-ja-5244x2950.png", 5244, 2950)
