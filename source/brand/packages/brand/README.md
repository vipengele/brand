# @vipengele/brand

The vipengele brand kit: the logo, mark and wordmark as vectors, plus the raster set the
contexts that cannot take a vector need. This file is both the engineer's reference and the
brand guidance — there is no second document to keep in agreement with it.

The package ships **artwork only** and has **no runtime dependencies**.

## Using it

```sh
pnpm add @vipengele/brand
```

```ts
import logo from "@vipengele/brand/svg/vipengele-logo-horizontal.svg";
import icon from "@vipengele/brand/svg/vipengele-icon.svg";
import appleTouch from "@vipengele/brand/png/apple-touch-icon-180.png";
```

`./svg/*` and `./png/*` resolve into the built `dist/`. Nothing is re-exported through a barrel,
so a consumer only ever pulls the file it names.

## Lockups

| File | Use |
| --- | --- |
| `vipengele-logo.svg` | Stacked lockup, light surfaces |
| `vipengele-logo-dark.svg` | Stacked lockup, dark surfaces |
| `vipengele-logo-mono.svg` | Stacked lockup, single colour (`currentColor`) |
| `vipengele-logo-horizontal.svg` | Horizontal lockup — nav bars, README headers |
| `vipengele-logo-horizontal-dark.svg` | Horizontal, dark surfaces |
| `vipengele-logo-horizontal-mono.svg` | Horizontal, single colour |
| `vipengele-wordmark.svg` / `-dark.svg` | Wordmark alone |

## Icon

| File | Use |
| --- | --- |
| `vipengele-icon.svg` | 512 box, 48 padding — the default icon |
| `vipengele-icon-dark.svg` | Same, dark-surface palette |
| `vipengele-icon-mono.svg` | `currentColor`, for buttons and inline UI |
| `vipengele-icon-tight.svg` / `-dark.svg` | Less padding — favicons and anything under 32px |
| `vipengele-icon-light-plate.svg` | On a white rounded square — app icons, avatars |
| `vipengele-icon-dark-plate.svg` | On a `#0B1220` rounded square |

## Raster

`icon-{16…1024}.png`, `icon-dark-{256,512,1024}.png`, `favicon-{16,32,48}.png`, `favicon.ico`
(16/32/48 multi-size), `apple-touch-icon-180.png`, `app-icon-{light,dark}-512.png`, `@2x` lockups,
and `og-{light,dark}-1200x630.png` for social cards.

Favicons and the `.ico` are cut from `vipengele-icon-tight.svg`, because the three faces stop
separating once the padded icon is scaled below 32px.

## Palette

The mark is an isometric block: a top face catching the light, a front-left face, and a
front-right face in shadow. Every colour below keeps that ordering.

| Role | Light surfaces | Dark surfaces |
| --- | --- | --- |
| top face, light end | `#5ABDFE` | `#86D1FF` |
| top face, dark end | `#4FA9FD` | `#6ABEFB` |
| left face, light end | `#2175FF` | `#4A8CFF` |
| left face, dark end | `#0F54F5` | `#2E6BFF` |
| right face, light end | `#353BC2` | `#4952D8` |
| right face, dark end | `#1F2E8B` | `#2F369E` |
| wordmark ink | `#0B182E` | `#EEF3FA` |

The dark variants lift each face just far enough to clear a `#0B1220` background while keeping the
shadow face darkest — the depth read survives the inversion. Legible on `#000000`, `#0B1220`,
`#161B22` and `#1E2433`.

These are the *artwork's* colours. They are not the design system's palette: a product UI takes its
colours from `@vipengele/react-tokens`, whose accent is a seed the theme ramps off, not a brand
constant.

## Typography

The wordmark is **Poppins Bold**, cap height 128 units, tracking `-0.02em`, and reads
**Vipengele**. Every published vector carries it as outlines, so nothing depends on the font being
installed. For UI text set alongside the logo, Poppins at 600 pairs cleanly —
[from Google Fonts](https://fonts.google.com/specimen/Poppins), not from this package.

## Clear space and minimum size

- Clear space: one quarter of the mark's height on all sides.
- Minimum icon size: **24px**. Below that use `vipengele-icon-tight.svg`; below 16px the three
  faces stop separating.
- Don't recolour individual faces, rotate the mark, or set the wordmark in another weight — use
  `-mono` when you need a single colour.

## Construction

- Corners use a constant **tangent inset** (38 units at artwork scale) rather than a constant
  radius. Acute corners therefore get tight arcs and obtuse corners generous ones, which keeps the
  straight run of every edge visually consistent.
- Face geometry: the left panel is a trapezoid (top edge 30.6°, bottom 33.9°); the right panel is a
  true parallelogram at 30.6°; the top face is a rhombus at ~33°.
- Gradients are linear and `userSpaceOnUse`.

## Building

`assets/src/` is the only artwork source. The lockups carry the name as live `<text>`, so it stays
editable and the file stays the single source of truth; the icon files have no text and pass
through untouched.

```sh
pnpm build     # assets/src → dist/svg (outlined) → dist/png (rasterized)
```

Generated output is never committed — `dist/` is what the build produces and what the package
publishes, so it cannot go stale against its sources.

## Licence

MIT (`LICENSE`).

The wordmark is set in [Poppins](https://fonts.google.com/specimen/Poppins), licensed under
OFL-1.1. The TTF lives in `assets/fonts/` with its `OFL.txt` as a build input; the published
package contains no font software, only outlined geometry.
