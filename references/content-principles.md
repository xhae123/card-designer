# Content Principles — Voice, Hooks, Narrative, Korean Style

> This file owns the **what to say**: hook patterns, narrative frameworks,
> tone selection, and Korean copywriting rules. It does NOT own character
> limits — those are enforceable hard caps in
> [`quality-gates.md`](./quality-gates.md). Treat the two files as a pair:
> this one shapes the voice, that one stops bad input from breaking layout.

## 1. Cover Slide (Hook)

**Goal:** a single line that stops the scroll.

**Rules:**

- Must be one of: question, number-based, or provocative
- Vague expressions prohibited ("알아보자", "함께해요", etc.)
- The reader should feel "this is about me"

**Character cap:** see [`quality-gates.md`](./quality-gates.md) §1 (`cover`).

**Hook patterns:**

| Pattern | Example | Suits |
|---|---|---|
| Number + result | "매출 3배, 바꾼 건 딱 하나" | Performance, tips, comparison |
| Provocative question | "아직도 그렇게 하고 있어요?" | Problem framing, education |
| Reversal / paradox | "열심히 할수록 망하는 이유" | Insight, perspective shift |
| Direct address | "주니어 개발자가 놓치는 3가지" | Target-specific content |
| Result first | "이직 성공률 90%의 비밀" | Methodology, know-how |

**Prohibited openings:**

- "~에 대해 알아봅시다" (boring)
- "오늘은 ~를 소개합니다" (this is not a TV show)
- "꿀팁 대방출!" (this is not a 2018 blog)

---

## 2. Body Slides

**Core principle: 1 slide = 1 idea.** One message per slide. Keep sentences
short — if a single sentence exceeds 2 lines, split it.

**Hard character limits live in [`quality-gates.md`](./quality-gates.md) §1**
(per-role caps for `statement`, `detail`, `list`, `comparison`, `quote`,
`data`). If the user's content exceeds a cap, split / drop / reject — never
silently truncate.

---

## 3. Narrative Frameworks

### Hook → Value → CTA (Default)

1. **Hook** (1 slide): grab attention
2. **Value** (3–5 slides): deliver practical value
3. **CTA** (1 slide): drive action

Suits: education, tips, insight content.

### Problem → Agitate → Solve (PAS)

1. **Problem** (1 slide): present the problem
2. **Agitate** (2–3 slides): dig deeper, build empathy
3. **Solve** (2–3 slides): present the solution
4. **CTA** (1 slide): drive action

Suits: product/service introductions, problem-solving content.

### Before → After → Bridge (BAB)

1. **Before** (1–2 slides): current state (discomfort/problem)
2. **After** (1–2 slides): ideal state (change/result)
3. **Bridge** (2–3 slides): how to get there
4. **CTA** (1 slide): drive action

Suits: transformation/growth stories, comparison content.

---

## 4. Korean Copy Rules

### Tone Selection

| Brand tone | Style | Example |
|---|---|---|
| Professional / business | Formal (-ㅂ니다) | "성과가 달라집니다" |
| Friendly / casual | Polite informal (-요) | "이렇게 해보세요" |
| Impact / direct | Casual (반말) | "이건 틀렸다" |
| Emotional / lyrical | Polite informal + literary mix | "당신의 하루가 달라져요" |

**Default:** polite informal (-요 style). Fits the broadest audience.

### Copy Quality Checklist

- [ ] Is subject omission natural? (subject omission is natural in Korean)
- [ ] Are particles correct? (은/는, 이/가, 을/를)
- [ ] Does no single sentence contain 2+ conjunctions?
- [ ] Is it written in plain language without overuse of Sino-Korean words?
- [ ] No unnecessary English mixing? (only essential technical terms)

---

## 5. CTA Slide

**Effective CTA patterns:**

| Pattern | Example | Purpose |
|---|---|---|
| Follow prompt | "더 많은 인사이트 → 팔로우" | Gain followers |
| Save prompt | "나중에 다시 볼 분 → 저장" | Increase reach |
| Comment prompt | "당신의 경험은? 댓글로" | Engagement |
| Share prompt | "동료에게도 알려주세요" | Viral |
| Link prompt | "자세한 내용 → 프로필 링크" | Conversion |

**CTA rules:**

- Request only one action (no simultaneous follow + save + share)
- End with a verb ("팔로우하세요" not "팔로우 부탁드립니다")
- Must include brand/account information
- Do not write "좋아요 눌러주세요" (ineffective)

---

## 6. Content Structuring Process

When the user presents a topic:

1. **Extract core message** — what's the single message this carousel must deliver?
2. **Confirm target audience** — who is reading? (`taste-profile.meta.targetAudience`)
3. **Select framework** — pick the narrative structure that fits
4. **Determine slide count** — default 5–7, max 10 based on info volume
5. **Assign roles** — one Card Role per slide
6. **Write copy** — apply the rules above
7. **Review rhythm** — verify alternation between high- and low-density slides

---

## 7. Copy Patterns to Avoid

- **Fact listing** — just listing facts without insight (so what?)
- **Textbook style** — stiff, explanatory writing
- **Overpromising** — overuse of "완벽한", "최고의", "혁신적인"
- **Long sentences** — more than 3 lines of text on a single slide
- **Numbers without context** — "87% do that" (of what? why?)
- **Weak opening** — "오늘은 ~에 대해서..."

## See also

- [`quality-gates.md`](./quality-gates.md) — hard character caps per role
- [`card-types.md`](./card-types.md) — spatial composition per role
