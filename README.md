# vipengele/brand

The org's brand assets: the logo, mark and wordmark as vectors, and the raster set the contexts
that cannot take a vector need.

| Project | Packages |
| --- | --- |
| [`source/brand`](source/brand) | [`@vipengele/brand`](source/brand/packages/brand) |

The brand guidance — lockups, palette, clear space, minimum sizes, construction — is
[`source/brand/packages/brand/README.md`](source/brand/packages/brand/README.md).

## Layout

One repo per language holds **projects**, each a self-contained pnpm workspace under
`source/<project>/` whose packages share one version and release on one tag `<project>@vX.Y.Z`.
This repo is the brand's, and holds one project.

## Commands (run from `source/brand`)

```bash
pnpm build          # turbo run build — outlines assets/src, then rasterizes
pnpm lint           # biome lint . --error-on-warnings
pnpm format:check   # biome format .
```

## Releasing

A human pushes the tag `brand@vX.Y.Z`; nothing else starts a release. The tag names both what is
released and at which version, and every non-private package in `source/brand` is published at it.
Release notes live in `docs/release-notes/<tag>.md` and must exist before the tag is pushed.
