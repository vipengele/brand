# Vipengele Brand

The org's brand context: the artwork every vipengele surface is built from, and the tooling that
turns the editable sources into what ships.

## Language

**Project**:
A self-contained pnpm workspace under `source/<project>/` whose packages share one version and are
released together by one tag `<project>@vX.Y.Z`. This repo holds one, `brand`.
_Avoid_: package (a project holds several), repo, module

**Artwork source**:
A file in `assets/src/`. The lockups carry the name as live `<text>`; the icon files are pure
geometry and carry none. It is the only thing committed that describes what the brand looks like —
everything under `dist/` is derived from it.
_Avoid_: master, original, design file

**Lockup**:
The mark and the wordmark placed together at a fixed relationship — stacked or horizontal. Distinct
from the **mark** (the isometric block alone) and the **wordmark** (the name alone). The
relationship is part of the artwork and is never reproduced by placing the two by hand.
_Avoid_: logo (ambiguous — it names the lockup, the mark and the wordmark interchangeably)

**Mark**:
The isometric block: a top face catching the light, a front-left face, and a front-right face in
shadow. The depth read — shadow face darkest — is what every palette variant preserves.
_Avoid_: icon (an icon is the mark packaged at a size with padding), logo, glyph

**Outlining**:
Replacing a `<text>` element with `<path>` elements carrying the glyph geometry, so a vector renders
identically where Poppins is not installed. What `build-svg.js` does, and the reason the name can
stay editable in the sources without the published files depending on a font.
_Avoid_: flattening, converting to curves, rasterizing (rasterizing produces pixels, not paths)

**Published set**:
What `dist/` holds and the package exports — outlined vectors and the rasters the manifest in
`build-png.js` names. It is never committed: the build produces it, so it cannot go stale against
the artwork sources.
_Avoid_: assets (the repo's `assets/` is the input, which is the opposite), build output, bundle

## Flagged ambiguities

**"Brand tokens"** — the artwork's colours are not the design system's palette. A product UI takes
its colours from `@vipengele/react-tokens`, whose accent is a **Seed** that ramps into a **Theme**;
the values in this repo describe the mark's faces and nothing else. This package publishes no
tokens, in any form, so the two can never be mistaken for one another.
