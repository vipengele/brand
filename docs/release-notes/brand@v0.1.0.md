# brand@v0.1.0

First release of `@vipengele/brand`.

## Added

- The vipengele lockups (stacked and horizontal, each in light, dark and mono), the wordmark, and
  the icon family — default, dark, mono, tight for small sizes, and light/dark plates.
- The published raster set: icons from 16 to 1024, favicons and a multi-size `favicon.ico`, an
  Apple touch icon, light and dark app icons, `@2x` lockups, and light and dark social cards.

The package ships artwork only and has no runtime dependencies. Vectors are exported under
`./svg/*` and rasters under `./png/*`.

## Notes

The artwork sources carry the name as live `<text>` in Poppins Bold; the build outlines it, so
every published vector renders without the font installed (`docs/adr/0001`).
