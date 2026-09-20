# The name stays as text in the artwork

The lockups in `assets/src/` set the name as a live SVG `<text>` element in Poppins Bold. The build
outlines it into `<path>` geometry, and the outlined vectors are what the package publishes and
what the rasters are rendered from.

Poppins Bold is committed in `assets/fonts/` with its `OFL.txt`, as a build input. The published
package contains no font software.

## Why not commit the artwork already outlined

Outlined artwork is a pile of path data. Changing the name, the tracking or the weight means
re-deriving that data somewhere outside the repo and pasting the result back, which makes the
external step the real source of truth and the committed file a cache of it. Keeping the name as
text means the thing a person edits and the thing the repo stores are the same thing.

The cost is a font and an outliner in the build. That cost is bounded: one TTF, one script, one
weight registered — a weight an SVG asks for and `FONT_SPECS` lacks fails the build rather than
silently substituting a face.

## Considered options

- **Commit outlined SVGs as the source.** No font, no outliner, and a build that only rasterizes.
  Rejected: the name becomes uneditable in the repo, and re-typesetting it is precisely what brand
  guidance everywhere tells you never to do by hand.
- **Generate the artwork from a geometry module.** The delivered bundle arrived this way — a Python
  module holding face geometry and palette, emitting the SVGs, the rasters and a React component
  from one source. Rejected: it puts a second language and a browser-based rasterizer in a repo
  that is otherwise artwork and two Node scripts, for a mark whose geometry is not expected to
  change. The construction notes it encodes are kept as documentation in the package README.
- **Ship the fonts with the package.** Rejected: consumers setting text in Poppins get it from
  Google Fonts, and shipping the TTF would put an OFL obligation in a tarball that otherwise
  carries only outlined geometry.

## Consequences

The build needs a font file, so `assets/fonts/` is a build input that must stay committed. Nothing
generated is committed, so there is no "output is up to date" check to keep honest — and equally,
reviewing an artwork change means reading the source diff or building locally, because the rendered
result is not in the tree.
