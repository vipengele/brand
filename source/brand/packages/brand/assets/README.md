# vipengele — brand assets

The guidance (lockups, palette, clear space, minimum sizes) is [`../README.md`](../README.md).

```
assets/
  src/      the artwork — lockups carry the name as live <text> in Poppins Bold;
            the icon files are pure geometry and have no text at all
  fonts/    Poppins Bold + its OFL.txt, read by the outliner, never published
  tools/    build-svg.js (src → dist/svg) and build-png.js (dist/svg → dist/png)
```

Every file shares one coordinate space, so the mark sits identically across all of them.
See [`tools/README.md`](tools/README.md) for how the published set is built.
