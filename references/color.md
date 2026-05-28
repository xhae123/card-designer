# Color

> Color carries 70% of a card's first impression. Three colors max — one
> dominates at 70%+, accent flashes at 10% or less. Equal distribution
> destroys hierarchy. Low contrast destroys readability. The palette
> reference below is every combination we've verified to meet WCAG AA at
> 4.5:1 or higher; anything outside it must be re-tested.

## 1. Base Rules

- **Max 3 colors per slide**: background + text + accent.
- **Contrast**: text-to-background ratio ≥ **4.5:1** (WCAG AA). Required,
  not recommended.
- **Dominant + sharp accent**: don't distribute colors timidly. One color
  dominates at **70%+**, accent is intense at **10% or less**.

## 2. Background Treatment

**Allowed:**
- Solid color background
- Brand color-based gradient (max 2 colors)
- Very subtle radial gradient (background variation)

**Prohibited:**
- Noise textures
- Repeating patterns
- Image backgrounds (unless explicitly specified)
- Gradients with 3+ colors

## 3. Text on Gradients

When placing text on gradient backgrounds, always apply one of:

```css
/* Method 1 — semi-transparent background box */
.text-on-gradient {
  background: rgba(0, 0, 0, 0.15);
  padding: 16px 24px;
  border-radius: 8px;
}

/* Method 2 — text shadow */
.text-on-gradient {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

## 4. Korean Finance Convention

In Korean stock/finance content:

- **Red = up / gain** (opposite of the international standard)
- **Blue = down / loss** (opposite of the international standard)

Reversing this confuses Korean readers. **Never** follow the international
standard for Korean finance.

## 5. Color Palette Reference

> All combinations meet WCAG AA 4.5:1 contrast or higher.
> `bg` = background, `fg` = foreground (text), `accent` = accent.

### 5.1 Dark Tones

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Tech/Dark | `#0F172A` | `#F8FAFC` | `#3B82F6` | IT, SaaS, developer content |
| Premium Dark | `#18181B` | `#FAFAFA` | `#A78BFA` | Luxury, premium services |
| Deep Navy | `#0C1222` | `#E2E8F0` | `#22D3EE` | Data, analytics, reports |
| Dark Forest | `#0A1F1A` | `#F0FDF4` | `#4ADE80` | ESG, eco-friendly, sustainability |

**Dark tone gradient variations:**

- `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` — subtle depth
- `linear-gradient(180deg, #18181B 0%, #27272A 100%)` — brightening toward bottom

### 5.2 Light Tones

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Tech/Light | `#F8FAFC` | `#0F172A` | `#2563EB` | Tech blogs, startups |
| Minimal/Modern | `#FAFAFA` | `#171717` | `#A855F7` | Design, lifestyle |
| Warm White | `#FFFBF5` | `#292524` | `#D97706` | Food, cafe, lifestyle |
| Cool Gray | `#F1F5F9` | `#1E293B` | `#0EA5E9` | News, information, education |

### 5.3 Brand Tone Specialized

| Tone | bg | fg | accent | Use case |
|---|---|---|---|---|
| Finance/Trust | `#FFFFFF` | `#1E293B` | `#0D9488` | Finance, investment, wealth |
| Emotional/Warm | `#FFF7ED` | `#431407` | `#EA580C` | Essays, emotional content |
| Health/Energy | `#ECFDF5` | `#064E3B` | `#10B981` | Health, fitness, wellness |
| Creative | `#FDF4FF` | `#3B0764` | `#D946EF` | Art, design, creative |

## 6. Dangerous Color Combinations (Absolutely Prohibited)

| Combination | Problem | Contrast |
|---|---|---|
| `#FFFFFF` bg + `#94A3B8` fg | Insufficient contrast — text unreadable | 2.8:1 |
| `#FBBF24` bg + `#FFFFFF` fg | Light bg + light text | 1.3:1 |
| `#EF4444` bg + `#3B82F6` fg | Complementary clash — eye strain | 2.1:1 |
| `#8B5CF6` bg + `#EC4899` fg | Saturation overload — visual fatigue | 2.4:1 |
| `#F3F4F6` bg + `#D1D5DB` fg | Gray on gray — ghost text | 1.5:1 |

**General rules:**

- Gray text on light backgrounds: only values darker than `#64748B`
  (contrast 4.6:1) are allowed.
- Don't use two highly saturated colors as fg/bg simultaneously.
- For finance content, red/blue must follow the Korean convention above (§4).

## 7. Anti-Examples

**Wrong — timid 33/33/33 distribution:**

```css
/* WRONG — no color dominates, no accent emerges */
.slide { background: #F8FAFC; }
.heading { color: #2563EB; }     /* accent used as primary */
.body    { color: #A855F7; }     /* second accent fights the first */
```

**Right — dominant + sharp accent:**

```css
.slide { background: #0F172A; }                  /* 70%+ */
.heading, .body { color: #F8FAFC; }              /* 20% */
.eyebrow, .divider, .stat-label { color: #3B82F6; } /* < 10% accent */
```

**Wrong — uncontrasted gray on white:**

```css
/* WRONG — 2.8:1, ghost text */
.body { color: #94A3B8; background: #FFFFFF; }
```

```css
/* RIGHT — 4.6:1+ */
.body { color: #475569; background: #FFFFFF; }
```

## See also

- [`typography.md`](./typography.md) for weight + color hierarchy interplay
- [`canvas.md`](./canvas.md) for SVG color = brand palette only
- [`anti-patterns.md`](./anti-patterns.md) E15–E17 for the verification checks
