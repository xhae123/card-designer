# Card News Self-Verification Checklist

> Run this checklist after every card news generation.
> If any item fails, do not show the result to the user — fix it and re-verify.
> Repeat until all items pass.

---

## Execution Protocol

0. (After rendering) Read the generated PNG with the Read tool to verify visual issues
1. Complete HTML/CSS card news generation
2. Run the checklist below **on each slide individually**
3. If any item fails:
   - Do not show the failed result to the user
   - Fix the failing item
   - Re-run the checklist from the beginning
4. Only present the result to the user after all items pass

---

## A. Density & Whitespace

### A1. Element Count
- [ ] Are there **5 or fewer** visual elements per slide?
- Count all text blocks, icons, dividers, brand marks, and decorative elements
- **On failure**: remove the weakest element. Deletion priority: decoration, divider, supporting text

### A2. Whitespace Ratio
- [ ] Is **60% or more** of the canvas empty space?
- Content must not occupy more than 40% of the total area
- **On failure**: do not shrink font-size — instead reduce content or split into the next slide

### A3. Safe Zone
- [ ] Is core content within the center 80% of the canvas?
- 108px on each side (at 1080px) is the safety margin
- **On failure**: increase padding or adjust content position

---

## B. Background & Decoration

### B4. Background Treatment
- [ ] Does the background use only solid color or brand gradient (max 2 colors)?
- Noise textures, repeating patterns, and 3+ color gradients are prohibited
- **On failure**: simplify to the nearest solid color or 2-color gradient

### B5. Unnecessary Decoration
- [ ] Are the following decorative elements absent?
  - Corner ornaments
  - Pagination dots (page indicator dots)
  - Glow/blur effects
  - Gradient borders
  - Background shape decorations (floating shapes, circles, blobs)
- **On failure**: remove all of them. Decoration exists only when it supports the message

### B6. Box Overuse
- [ ] Are list items NOT wrapped in individual boxes/cards?
- Putting background + border-radius + shadow on each item creates a UI component library, not card news
- **On failure**: remove boxes and separate with text + spacing only

---

## C. Typography

### C7. Font Weight Diversity
- [ ] Are you NOT using only 400 and 700?
- Each slide must have at least 2 different weights
- Must include at least one of 300, 500, 600, or 800
- **On failure**: change title to 800, labels to 500 or 600

### C8. letter-spacing
- [ ] Is letter-spacing appropriate for each size?
  - 36px and above: `letter-spacing: -0.02em` (negative)
  - 24-35px: `letter-spacing: 0` (default)
  - 23px and below: `letter-spacing: 0.04em` (positive)
- **On failure**: correct according to the rules above

### C9. Size Ratio
- [ ] Is heading **1.5x or more** of body?
- Is hero number **3x or more** of body?
- **On failure**: increase heading size or decrease body size to match the ratio

### C10. Adaptive Sizing
- [ ] Is a sufficiently large font-size used for short text (8 chars or fewer)?
- A single-line title at 32px or below wastes space
- **On failure**: adjust to appropriate size for text length (see design-principles.md 2.1)

### C11. AI Slop Fonts
- [ ] Are Inter, Roboto, Arial, Helvetica NOT used?
- **On failure**: replace with Pretendard, SUIT, Wanted Sans, etc.

---

## D. Alignment & Placement

### D12. Alignment Default
- [ ] Is center alignment NOT used for Korean body text (3+ lines)?
- Korean text defaults to left alignment. Center alignment is only allowed for single-line titles, quotes, and CTAs
- **On failure**: change to `text-align: left`

### D13. Top-Heavy Layout
- [ ] Is content NOT clustered at the top with the bottom third empty?
- The visual center is slightly above the mathematical center, but the bottom must not be completely empty
- **On failure**: correct visual center with `justify-content: center` and additional bottom padding (40px)

### D14. Value Uniformity
- [ ] Are padding, gap, and border-radius NOT all the same value?
- Identical values everywhere indicate mechanical repetition, not intentional design
- Use at least 2-3 different spacing values
- **On failure**: apply differentiated values by hierarchy (e.g., section gap 48px, item gap 28px, text gap 12px)

---

## E. Color & Contrast

### E15. Text-Background Contrast
- [ ] Do all text elements have **4.5:1 or higher** contrast against their background? (WCAG AA)
- Pay special attention to text on gradient backgrounds and light gray text
- **On failure**: darken text color, add semi-transparent background box, or apply text-shadow

### E16. Color Count
- [ ] Are there **3 or fewer colors** per slide? (background + text + accent)
- **On failure**: remove the weakest color. Secondary color first, then decorative color

### E17. Color Distribution
- [ ] Is one color **dominant (70%+)** with accent used **sharply (10% or less)**?
- Equal 33% distribution across all colors destroys visual hierarchy
- **On failure**: increase background color area and concentrate accent on focal points only

---

## F. Content Structure

### F18. 1 Slide = 1 Message
- [ ] Does each slide convey **only one idea**?
- Two different stories must not exist on one slide
- **On failure**: split into two slides

### F19. Emoji Usage
- [ ] Are NO emojis used?
- Rendering varies across OS, causing breakage in Puppeteer. Only inline SVG is allowed
- **On failure**: replace emojis with inline SVG icons, or handle with text only

### F20. word-break
- [ ] Is `word-break: keep-all` applied to all Korean text?
- Korean text breaking at character level severely degrades readability
- **On failure**: add `word-break: keep-all` to all Korean text elements

---

## G. Full Carousel Verification (Run after individual slide verification)

### G21. Visual Consistency
- [ ] Are the following identical across all slides?
  - Font family
  - Color palette
  - Padding values
  - Brand mark position (if present)
- **On failure**: unify the rest based on the first slide's tokens

### G22. Layout Variation
- [ ] Do NO two consecutive slides have the **exact same layout**?
- Repeating the same layout causes visual fatigue
- **On failure**: change to a different card type pattern (see design-principles.md section 5)

### G23. Narrative Structure
- [ ] Does it follow the Hook, Context, Value Delivery, Summary/CTA sequence?
- Is the first slide a cover/hook? Is the last slide a CTA?
- **On failure**: rearrange slide order

### G24. Font Family Count
- [ ] Are there **2 or fewer** font families across the entire carousel?
- **On failure**: remove the least-used font and consolidate to the primary font

---

## Checklist Summary (Quick Reference)

```
Per slide:
  [] A1  5 or fewer elements
  [] A2  60%+ whitespace
  [] A3  Safe zone compliance
  [] B4  Background: solid or 2-color gradient
  [] B5  No unnecessary decoration
  [] B6  No box overuse
  [] C7  Font weight diversity
  [] C8  letter-spacing rules followed
  [] C9  heading/body size ratio 1.5x+
  [] C10 Adaptive sizing
  [] C11 No AI slop fonts
  [] D12 Korean text left-aligned by default
  [] D13 No top-heavy layout
  [] D14 Value uniformity avoided
  [] E15 Contrast 4.5:1+
  [] E16 3 or fewer colors
  [] E17 Dominant color + sharp accent
  [] F18 1 slide = 1 message
  [] F19 No emoji usage
  [] F20 word-break: keep-all

Full carousel:
  [] G21 Visual consistency
  [] G22 Layout variation
  [] G23 Narrative structure
  [] G24 2 or fewer font families
```
