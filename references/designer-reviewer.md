# Designer Reviewer — 외부 시선 (Opt-In)

The skill's own Visual Critique loop ([10.7]) is **self-critique** — the same model that generated also evaluates. This has a structural blind spot: pattern issues the generator created (duplicate hierarchy, awkward baseline alignment, formulaic layouts) are exactly the patterns it accepts as normal.

This file defines an **opt-in external reviewer** — a fresh agent with a senior brand designer persona that reads the rendered PNGs cold, without context of how they were made.

> **Trigger pattern:** modeled after gstack's `codex review` / `design-review`. User-invoked, not automatic. Inserted at **Step [11.5]** in the generation flow, between self-critique and final preview.

---

## When to offer this

After Step [10.7] Visual Critique returns `ship` (with or without minor concerns). Ask the user:

```
디자이너 리뷰어 돌릴까요? 외부 시선으로 한 번 더 체크해요.
시니어 브랜드 디자이너 페르소나가 렌더된 PNG를 cold로 봅니다.
(A) 네, 돌려주세요
(B) 그냥 보여주세요
```

Use `AskUserQuestion` tool. Header: "외부 리뷰". Single-select.

If `B`: proceed to [11] Present Preview directly.
If `A`: spawn the agent (next section), wait for results, surface findings, then [11] Present Preview with annotations.

**Do NOT offer this when:**
- Self-critique returned `retry-hard` after exhausting retries (the slides need fixing, not reviewing)
- The series is a small iteration (1-2 slides) on previously-approved cards — review fatigue
- The user has already opted out twice in this session

**Do offer this proactively when:**
- This is the first series for a new brand (high-stakes calibration)
- The user has expressed concern about quality ("이거 잘 빠졌나?", "디자이너스럽지 않은데")
- Self-critique returned ship but with 3+ minor concerns (close call)

---

## The Reviewer Agent — Persona

The spawned agent's system prompt MUST embody this persona. Do not paraphrase loosely; the persona produces the quality.

```
You are a senior brand designer with 15+ years of experience designing
Instagram carousels, brand identity systems, and editorial layouts for
Korean and global clients. Background: design school + agency + in-house
brand lead. Worked on brands across fintech (Toss-tier), education
(Class101-tier), and lifestyle.

You are blunt, specific, and opinionated. You speak Korean 해요체 to the user.
You do NOT say "looks good" without specific reasons. You DO say
"이건 잘못됐어요, 왜냐하면..." with evidence.

You are evaluating a 카드뉴스 시리즈 someone else made. You have no context
about how it was built — only the rendered PNGs and a brief about the
brand's grammar (handed to you in the prompt).

Your eye is calibrated against:
- 토스/Linear/Stripe (premium tech)
- New Yorker spots, Pitch decks (editorial)
- Notion, Duolingo (friendly mascot-driven)
- Memphis revival, Spotify Wrapped (high-energy)
- 멋사 reference materials, 경희대 학생 동아리 카드뉴스 일반 수준

Output structure (mandatory):
1. Overall verdict in one sentence — would you publish this?
2. Per-slide list of CONCRETE issues with location ("3슬라이드 우측 상단의...")
3. 1-3 series-level patterns to fix (the deepest issues, not nitpicks)
4. ONE thing this series does well (calibrate against fawning)

You do NOT mention process. You do NOT mention "the AI did this". You
review the work as if it landed on your desk from a designer colleague.
```

---

## The Review Brief — passed in the agent prompt

```markdown
[BRIEF FOR DESIGNER REVIEWER]

Brand: {brand name + 1-line essence from brand-master.md}
Mood: {assetLanguage.mood}
Voice: {voice adjectives}
Signature elements: {logo, paperclip, folder-card, ...}

Topic of this series: {topic}
Series intent: {what the carousel is communicating}

Output: {output-dir absolute path}, files slide_01.png ~ slide_NN.png

Read every PNG with the Read tool. Review per the persona instructions.
Korean output. Specific. 600 words max.
```

---

## Calling the agent (operational)

```python
Agent(
  description="Designer review of carousel",
  subagent_type="general-purpose",
  prompt=PERSONA_PROMPT + "\n\n" + BRIEF + "\n\nRead the PNGs at {output-dir} now."
)
```

Wait for completion (do not run in background — user is waiting). When the agent returns:

1. Quote the verdict sentence verbatim to the user.
2. Show the per-slide issues as a structured block.
3. Show the series-level patterns prominently — these are the load-bearing fixes.
4. Quote the "one thing done well" — keeps reviewer honest.

Then ask the user:
```
이 피드백 중 어떤 걸 반영할까요?
(A) 전부 다 — 다시 만들어주세요
(B) 시리즈 레벨 패턴만 — 미세한 건 패스
(C) 특정 슬라이드만 — 어떤 거 콕 찍어주세요
(D) 다 보고 일단 PNG 받기 — 나중에 결정
```

If A/B: regenerate affected slides, re-run [10.5]/[10.7], offer reviewer again (max 2 review passes per series — beyond that, designer is over-reviewing).

If D: proceed to [11] Present Preview with the review notes attached as text.

---

## Logging review outcomes

Every reviewer invocation appends to `brands/{name}/learnings.jsonl`:

```jsonl
{"ts":"...","type":"designer-review","series":"output/20260528_2350","verdict":"publishable_with_concerns","issues_count":3,"applied":["series-pattern-1","slide-3-issue-2"],"declined":["slide-5-nitpick"]}
```

Why log this:
- After 5+ reviewer invocations, patterns emerge in what the reviewer consistently catches that self-critique misses. Surface this as: "이번 세션부터 self-critique에서 X 차원 더 엄격하게 볼게요" (gradual calibration of internal critique).
- Tracks user agreement rate with reviewer findings. If user declines >70% of suggestions, the persona prompt may be too aggressive — surface for user tuning.

---

## What this does NOT replace

- **Self-critique [10.7]** still runs every time. Reviewer is additive, not a substitute.
- **User preview & feedback [11]/[12]** still happens. Reviewer is a pre-flight check before the user sees output.
- **Anti-patterns checklist** still runs. Reviewer catches subjective taste, anti-patterns catches objective rules.

---

## Failure modes

- **Reviewer says "looks good"** with no specifics → persona prompt was too soft. Re-spawn with hardened "be specific or be silent" version.
- **Reviewer hallucinates** issues not present in the PNG → the agent didn't actually read the PNGs. Persona prompt MUST include "Read every PNG with the Read tool" verbatim.
- **Reviewer recommends out-of-brand fixes** ("색을 보라색으로 바꿔라" when brand is locked orange) → didn't internalize the brief. Brief must lead with brand constraints.
- **Reviewer is too harsh and demands 10+ retries** → diminishing returns. Cap: 2 review passes per series. After that, ship with concerns noted.

---

## Why opt-in (and not always-on)

- Adds latency (~30-60s for fresh agent + PNG reads).
- Adds cognitive load to the user (more decisions per series).
- The skill should be lightweight by default; reviewer is the "premium polish" option for high-stakes series.
- gstack pattern: power tools surface on user invocation, not by default.

The skill works without reviewer. Reviewer makes it sharper when stakes warrant it.
