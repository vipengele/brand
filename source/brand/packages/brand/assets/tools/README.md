# vipengele — brand build tools

Two scripts turn `assets/src/` into everything the package publishes. Both are run by
`pnpm build`; neither ships.

```
assets/src/ ──build-svg.js──► dist/svg/ ──build-png.js──► dist/png/
```

---

## `build-svg.js` — outline the wordmark

The lockups in `assets/src/` set the name as live `<text>` in Poppins Bold, so the artwork stays
editable and the name is never a pile of path data somebody has to re-typeset. Those files only
render correctly where Poppins is installed. This script replaces every `<text>` element with
`<path>` elements carrying the glyph outlines, leaving all other markup — the mark, transforms,
`viewBox`, gradients — exactly as it was. The icon files contain no text and pass through unchanged.

Glyph placement uses [`opentype.js`](https://github.com/opentypejs/opentype.js):

1. `font.stringToGlyphs(text)` → the glyph for each character
2. for each glyph, `glyph.getPath(x, baseline, fontSize)` → its outline as path data
3. advance `x` by `glyph.advanceWidth * fontSize/unitsPerEm + letterSpacing`, plus
   `font.getKerningValue(prev, glyph)` between pairs

A fitted run (`textLength` with `lengthAdjust="spacing"`) is solved the way a browser solves it:
measure the natural width, set `letterSpacing = (target − natural) / (glyphCount − 1)`, then one
correction pass.

Poppins Bold is committed in `assets/fonts/`, so this normally runs offline; a missing TTF is
downloaded once. Bold is the only weight registered in `FONT_SPECS` — a weight an SVG asks for and
the map lacks is an error, not a silent substitution.

## `build-png.js` — render the published raster set

The manifest at the top of the script is the whole contract: the sizes named there are the sizes
the package promises in its `exports`. A context needing a raster gets a name added to the
manifest rather than rasterizing on demand, so what ships is what is published.

Rendering is [`@resvg/resvg-js`](https://github.com/yisibl/resvg-js) — no browser, which keeps the
build deterministic and CI light. Two cases are worth knowing:

- **Social cards** are built as a wrapper SVG that inlines the lockup's own markup under a
  transform over a background `<rect>`, so the card rasterizes in one pass at full resolution
  rather than being composited from rendered pixels.
- **`favicon.ico`** is assembled here: a 6-byte header, one 16-byte directory entry per image, then
  the PNG payloads verbatim. `.ico` may wrap PNG directly, so nothing is re-encoded and no extra
  dependency is needed.

---

Input to `build-png.js` is always `dist/svg` — the outlined vectors. The `src/` files rely on an
installed font and render wrongly on a machine without it.
