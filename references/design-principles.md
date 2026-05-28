# Design Principles — Index

> This is the index to the design rule system. As of v0.4.0, the monolithic
> `design-principles.md` has been split into 6 focused files. Each file opens
> with a mission statement and ends with anti-examples.
>
> **Rule of thumb:** rules without specific numeric values are not rules.
> Every cap, ratio, and unit in these files is enforceable.

## When to load which file

| File | What's inside | Load when |
|---|---|---|
| [`canvas.md`](./canvas.md) | Canvas dimensions, CSS reset, mandated `absolute + translateY(-50%)` centering, SVG illustration constraints | Always |
| [`typography.md`](./typography.md) | Size scale, Korean rules, weight diversity, font selection, anti-slop guardrails | Always |
| [`layout.md`](./layout.md) | Space allocation, alignment, vertical placement, slide sequence, narrative arc | Always |
| [`color.md`](./color.md) | Color rules, palette reference, dangerous combinations, Korean finance convention | Always |
| [`card-types.md`](./card-types.md) | Per-role spatial composition (ASCII diagrams + CSS patterns side by side) | Read only the role(s) you are generating |
| [`golden-examples.md`](./golden-examples.md) | 4 full HTML reference slides — the quality bar | First slide of any new series, or when checking quality |

## Brand application note

When brand information is provided, declare colors as CSS variables on `:root`
(`--brand-primary`, `--brand-secondary`, `--brand-accent`). Brand mark belongs
on the cover and CTA slides only; on middle slides omit it or keep it tiny.
If brand info is missing, choose content-optimized colors and tone — never
fall back to generic defaults.

See [`color.md`](./color.md) for palette guidance and
[`card-types.md`](./card-types.md) for brand mark placement patterns.

## Cross-references

- Hard character caps and series limits → [`quality-gates.md`](./quality-gates.md)
- Voice / hook patterns / narrative frameworks → [`content-principles.md`](./content-principles.md)
- Forbidden patterns and the verification checklist → [`anti-patterns.md`](./anti-patterns.md)
- Visual effects (halftone, glass, noise, 3D) → [`visual-effects.md`](./visual-effects.md)
- Font @import URLs and pairing presets → [`font-presets.md`](./font-presets.md)
