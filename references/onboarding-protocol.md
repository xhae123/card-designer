# Brand Onboarding Protocol — Designer Kickoff Interview

The most important conversation in this skill. Loaded once when SKILL.md routes to Brand Onboarding.

> **The thesis.** Surface tokens (color, font, padding) are easy to copy. **Brand grammar** — the master vocabulary, the visual idioms, the recurring composition patterns, the voice-visual coherence — cannot be copied without doing the same investigation. This protocol IS the moat.

> **Persistence rule.** "집요하게 조사" — do not let the user skip the depth. If they push for a fast 3-question onboarding, push back once: "이 단계가 브랜드의 차별성을 결정해요. 15분만 시간 내주시면 평생 자산이 됩니다." If they refuse, you may compress, but never skip Phases 2 / 3 / 4 / 6.

---

## Outputs of this protocol

By the end, the following files exist under `brands/{name}/`:

```
brands/{name}/
  taste-profile.json     # surface tokens (color, font, spacing)
  brand-master.md        # the constitution — voice, essence, vocabulary, idioms, patterns, anti-patterns
  idioms.json            # machine-readable idiom library (emphasis, list, data, divider, etc.)
  evolution.md           # append-only brand evolution log, v1.0 entry
  manifest.json          # asset index (initially: logo + any signature motifs created in onboarding)
  assets/
    logo.svg             # SVG-ized from user upload, or generated fresh
    signature/           # signature SVGs created during onboarding
    raw/                 # original user uploads preserved
  timeline.jsonl         # session timeline, "onboarded" event
  learnings.jsonl        # learning log, initial entries from onboarding
```

---

## Designer mindset for the AI

You are not filling out a form. You are a senior brand designer conducting a kickoff. The user is the client. Your job:

- **Listen, then reframe.** When the user says "친근한 느낌", ask which kind — Notion-friendly? Duolingo-friendly? Toss-friendly? Make them be specific.
- **Show, then ask.** When a decision is hard to verbalize (mood, geometry, light source), show 2-3 visual options and let the user point. People answer "이거 어때요?" better than "어떤 거 원하세요?"
- **Push back when needed.** If the user picks contradictory things ("brutalist + warm"), name the conflict and ask which they value more.
- **Capture the language.** Quote the user verbatim into `brand-master.md` Voice section. Their words become the brand's voice forever.
- **Treat existing assets as forensic evidence.** Every uploaded image tells you 5 things: dominant mood, light source, palette, geometric grammar, stroke stance. Extract all 5 before asking the user a single mood question.

---

## Phase 0 — Detect onboarding mode

Before the first question, decide which path:

```
Has the user provided existing brand assets (logo, mascot, screenshots)?
  ├─ YES → "Existing Brand" path (Phases 1, 2-DEEP, 3-INFER, 4, 5, 6, 7)
  │         Forensic-first: infer the system from assets, then confirm
  └─ NO  → "New Brand" path (Phases 1, 3-SHOTGUN, 4, 5, 6, 7)
            Discovery-first: shotgun mood selection, then build outward
```

Announce the path to the user briefly: "기존 자산이 있네요, 그걸로 브랜드 시스템 먼저 분석할게요" or "새 브랜드네요, 무드 시안 3가지부터 보여드릴게요."

---

## Phase 1 — Discovery (1-2 turns)

### Ask in one message (mandatory)

```
브랜드 만들기 시작할게요. 몇 가지 한 번에 물어볼게요:

기본 정보
- 브랜드/채널 이름
- 분야 (fintech, 교육, 패션, 라이프스타일, dev tool, 미디어 ...)
- 인스타/사이트 핸들 (있으면)

본질
- 한 문장으로 이 브랜드는 무엇인가요? (예: "대학 코딩 동아리", "Z세대 금융 앱")
- 타겟은 누구인가요? (구체적으로 — "20대 직장인 여성" / "고등학생 코딩 입문자")

톤
- 다음 중 3개만 골라주세요: 전문적 / 친근한 / 임팩트 / 미니멀 / 디자인 / 따뜻한 /
  쿨한 / 정확한 / 시적 / 거친 / 큐트 / 럭셔리
- 절대 안 됐으면 하는 톤은? (예: "딱딱한 거 싫음", "유치하면 안 됨")
```

### Designer follow-up questions (ask 2-3 of these, pick by what's missing)

- "Toss랑 Linear는 둘 다 미니멀인데, 둘 중 어느 쪽에 가깝나요?"
- "비슷한 분야에서 '이렇게는 절대 안 보이고 싶다' 하는 브랜드 있어요?"
- "본인 브랜드를 한 단어로 표현하면? (그 단어는 모든 디자인 결정의 기준이 됨)"

Record verbatim quotes from the user into `brand-master.md` → Voice section. Their language becomes the brand's language.

### Outputs after Phase 1
- `taste-profile.json` skeleton with `meta.{voice, industry, targetAudience, instagramHandle, tagline}` filled
- `brand-master.md` skeleton with Essence + Voice (verbatim quotes) sections drafted

---

## Phase 2 — Existing Asset Forensics (only if assets provided)

> Skip if no existing assets. If skipped, the equivalent investigation happens in Phase 3-SHOTGUN.

For each provided asset (image upload, file, URL):

### Step 2.1 — Save raw
Copy original to `brands/{name}/assets/raw/{descriptive-name}.{ext}`. Never edit the raw.

### Step 2.2 — Extract 5 forensic dimensions
Read the image (use Read tool). For each, write the extracted value into a forensics block in `brand-master.md`:

| Dimension | What to extract | Example |
|---|---|---|
| **Dominant mood** | Which `asset-moods.md` mood does it match? (lazy-load if needed) | `sticker-kawaii` + accent of `iso-3d-gradient` |
| **Light source** | Where do highlights/shadows imply light from? | top-center, soft |
| **Color palette** | 3-5 dominant colors, in hex, ranked by area | `#F05A2A` 45%, `#FFFFFF` 30%, `#0A0604` 20%, `#FFB489` 5% |
| **Geometric grammar** | Circles / sharp angles / rounded rects / mixed? | rounded (scalloped, soft curves) |
| **Stroke stance** | Outlined-bold / outlined-thin / solid-fill / mixed? | mixed — outlined-bold on logo, solid-fill on iso objects |

### Step 2.3 — SVG-ize every asset (NON-NEGOTIABLE)
This is the rule from `asset-language.md` §2. Every raster → SVG.

For each asset:
1. Trace by eye — recreate as inline-clean SVG using `<path>`, `<circle>`, `<rect>`, gradients.
2. Save to `brands/{name}/assets/logo.svg` (if logo) or `brands/{name}/assets/signature/{name}.svg` (if motif).
3. Render standalone via `scripts/render.js` to verify.
4. Show the user: "원본 vs SVG화 결과 비교해보세요."
5. Iterate on user feedback until approved.
6. Register in `manifest.json` with `tier: signature`, `rasterSource: raw/...`, full metadata.

### Step 2.4 — Infer the brand system
Synthesize the 5 dimensions across all assets into a draft brand grammar. Present to the user:

```
기존 자산 5장 분석 끝났어요. 추출한 시스템:

무드: sticker-kawaii(로고) + iso-3d-gradient 액센트(오렌지 디스크)의 하이브리드
광원: top-left 30도 (모든 그림자 일관)
팔레트: 오렌지 #F05A2A (메인) / 다크 #0A0604 (배경) / 크림 #FFB489 (3차) / 흰색 (텍스트)
기하: rounded — 스캘럽, 둥근 모서리, 소프트 커브
스트로크: mixed — 로고는 outlined-bold(검정 6px), iso는 solid-fill

시그니처 모티프 (자주 등장):
- 사자 마스코트 (kawaii)
- 오렌지 클립 (iso-3d)
- 폴더 카드 (흰 탭 + 오렌지 바디)
- 하프톤 도트 배경 페이드
- 검정 하이라이트 박스 (텍스트 강조)

이거 맞아요? 빠진 거 있어요?
```

Iterate until confirmed.

### Outputs after Phase 2 (Existing Brand path)
- All raw assets saved to `raw/`
- All assets SVG-ized and in `signature/`
- `taste-profile.json` color + typography + spacing tokens populated with `confidence: 0.7-0.8`
- `brand-master.md` Forensics + Inferred Grammar sections complete
- `manifest.json` registers each signature asset

---

## Phase 3 — Mood Direction (SHOTGUN or INFER)

### 3-SHOTGUN (New Brand path)

Lazy-load `asset-moods.md` now.

Generate **3 cover-card variants** using the same dummy content but completely different moods. Pick the 3 most plausible for this industry from `asset-moods.md` §"Mood × Brand Industry Quick-Pick".

Example for an education brand:
- A: `sticker-kawaii` (cute mascot energy)
- B: `editorial-line` (premium learning)
- C: `notion-doodle` (friendly explainer)

Show all 3 by `open`-ing the PNGs simultaneously. Ask:
```
3가지 무드 시안이에요. 각각 같은 내용을 완전 다른 시각 언어로 표현했어요:

A — sticker-kawaii: 두꺼운 외곽선 + 파스텔 + 둥근 마스코트 (Notion, Duolingo 같은 결)
B — editorial-line: 단일 잉크 라인 + 여백 충만 (New Yorker, 프리미엄 출판물)
C — notion-doodle: 손그림 떨림 + 듀오톤 (Notion, Excalidraw 같은 캐주얼)

어느 쪽이 가장 가까워요? 섞어도 됩니다 ("A인데 B처럼 차분하게" 등).
```

Capture the choice → `assetLanguage.mood`. Also capture rejected directions → `learnings.jsonl` as `rejected` entries.

### 3-INFER (Existing Brand path)

You already inferred the mood in Phase 2. Confirm with the user:

```
분석한 무드는 sticker-kawaii + iso-3d-gradient 하이브리드예요. 다음으로 갈까요?
또는 새 시리즈에서는 다른 무드로 가고 싶으면 말해주세요.
```

If user says "다른 무드", drop into 3-SHOTGUN.

### Outputs after Phase 3
- `taste-profile.json` `assetLanguage.mood`, `lightSource`, `strokeStance`, `geometry` populated
- `brand-master.md` Mood section finalized

---

## Phase 4 — Master Vocabulary & Idiom Investigation (★ THE MOAT)

This is the longest phase and the most important. Real brand stickiness lives here.

### Step 4.1 — Master Vocabulary (signature motifs)

Ask:
```
이 브랜드가 자주 등장시킬 시그니처 오브제는 뭐가 있을까요?
(예: 사자 마스코트, 오렌지 클립, 폴더 카드, 도트 패턴 — 이미 있죠.
새로 만들고 싶은 것 있나요? 예: 트로피, 책, 노트북 등)
```

For each motif the user wants:
1. Generate a sample SVG in the chosen mood
2. Show preview
3. Iterate
4. Save to `signature/` with manifest entry

Suggest 2-3 motifs from designer judgment if user is stuck: "이 무드 + 분야에서는 보통 [X, Y, Z]를 자주 써요."

### Step 4.2 — Visual Idioms (★ this is where brands become inimitable)

Idioms = how this brand specifically expresses common card-news needs. Walk through each need, show 2-3 idiom options, capture the choice.

For each of the **8 universal idioms**, propose options and lock the choice:

| Idiom | What it represents | Example options (mood-dependent) |
|---|---|---|
| **emphasis** | How to highlight a keyword | "검정 박스 + 흰 텍스트" / "오렌지 언더라인" / "두꺼운 굵기 변화" |
| **divider** | How to separate sections within a slide | "점선" / "오렌지 짧은 바 40px" / "도트 시퀀스" |
| **list-item** | How a list bullet looks | "오렌지 숫자 80px" / "검정 라벨 박스" / "도트 + 인덴트" |
| **data-anchor** | How a big number is anchored | "거대 숫자 140px + 오렌지" / "검정 박스 안 흰 숫자" / "퍼센트 차트" |
| **callout** | "여기 주목" 표시 | "사자 마스코트가 가리킴" / "화살표 SVG" / "강조 박스" |
| **success-feel** | 긍정/완료 표현 | "스파클 SVG" / "체크 마크" / "축하 폭죽" |
| **container** | 정보 묶음 컨테이너 | "폴더 카드 (흰 탭 + 컬러 바디)" / "둥근 박스" / "글래스모피즘 카드" |
| **background-texture** | 배경 무지 처리 | "하프톤 도트 페이드" / "노이즈 텍스처" / "그리드" / "단색" |

Don't ask all 8 in one message. Walk through 2-3 at a time, show options, lock, move on. Total 3-4 turns.

Each locked idiom becomes an entry in `idioms.json`:

```json
{
  "emphasis": {
    "type": "inline-highlight",
    "html": "<span class=\"emph\"><strong>{TEXT}</strong></span>",
    "css": ".emph { background: #000; color: #fff; padding: 4px 12px; font-weight: 800; }",
    "rationale": "사자 로고의 검정 입과 시각적으로 호응. 사용자 선택 — 2026-05-28"
  },
  "data-anchor": {
    "type": "huge-number",
    "html": "<div class=\"data-num\">{NUM}<span class=\"data-unit\">{UNIT}</span></div>",
    "css": ".data-num { font-size: 168px; font-weight: 900; color: #F05A2A; line-height: 1; } .data-unit { font-size: 48px; }",
    "rationale": "임팩트 톤 강조. 사용자 선택 — 2026-05-28"
  }
}
```

### Step 4.3 — Composition Patterns

Ask:
```
구도 패턴 잡을게요. 몇 가지 결정해야 해요:

1. Cover 구도 — 타이틀 위치는?
   (a) 중앙 / (b) 좌상단 / (c) 우상단

2. Cover에 시그니처 오브제 위치?
   (a) 우하단 / (b) 좌하단 / (c) 가운데 뒤 / (d) 안 넣음

3. Detail 슬라이드 — 어떤 컨테이너?
   (a) 폴더 카드 (시그니처) / (b) 깔끔한 박스 / (c) 컨테이너 없음 — 풀블리드

4. 브랜드 마크 위치 — 모든 슬라이드?
   (a) 상단 좌측 / (b) 하단 우측 / (c) cover에만 / (d) 안 넣음

5. 슬라이드 번호 표시?
   (a) "1 / 7" 우하단 / (b) 점 인디케이터 / (c) 표시 안 함
```

Lock each → `brand-master.md` Composition Patterns section.

### Step 4.4 — Voice-Visual Coupling

Final coupling step. Ask:
```
브랜드 톤과 비주얼이 충돌하지 않게 몇 가지 규칙 더 잡을게요:

- 한국어 굵기: Pretendard 900 (Black) / 800 (ExtraBold) / 700 (Bold) 중?
- 강조 텍스트는 오렌지 컬러로 가는가 검정 박스로 가는가?
- 영문 텍스트 (POSSIBILITY TO REALITY 같은): letter-spacing 넓게 / 좁게?
- 본문에 절대 안 쓸 것: serif 폰트? 그라데이션 텍스트? 4px 미만 stroke?
```

### Outputs after Phase 4
- `idioms.json` populated with 8 universal idioms
- `brand-master.md` Master Vocabulary + Composition Patterns + Voice-Visual sections complete
- 2-5 new SVGs added to `signature/` with manifest entries

---

## Phase 5 — Sample Series Validation

Generate **a 3-slide mini-series** (cover + detail + cta) using everything captured so far. Same dummy content the user can mentally replace.

Render, `open` all three. Ask:
```
지금까지 잡은 모든 룰을 적용해서 3슬라이드 미니 시리즈 만들었어요:
- Cover: 시그니처 오브제 + 타이틀 구도
- Detail: 폴더 카드 idiom + 강조 idiom 사용
- CTA: 마스코트 + 콜투액션

이게 브랜드 느낌 맞아요? 수정할 거 있어요?
```

Iterate until user approves. Each iteration:
- If color/font tweak → update `taste-profile.json`
- If idiom replacement → update `idioms.json`
- If new motif requested → add to `signature/` + `manifest.json`

### Outputs after Phase 5
- Sample series approved
- All files updated with any iteration changes

---

## Phase 6 — Anti-pattern Capture

Often skipped in lazy onboardings — do not skip here.

Ask:
```
마지막으로 — 이 브랜드에서 '절대 안 됐으면 하는 것' 정리해주세요.
다른 브랜드에서는 멋질 수 있지만, 우리는 NO 인 것들:

(예시)
- 라이트 배경 절대 X
- Serif 폰트 X
- 그라데이션 텍스트 X
- 4명 이상 인물 일러스트 X
- 사진 배경 X
- 검정 외 다른 컬러 하이라이트 박스 X
- ...
```

Capture verbatim into `brand-master.md` Anti-patterns section. Also append `type: rule, applies_to: ["all slides"]` entries to `learnings.jsonl` so future sessions enforce automatically.

### Outputs after Phase 6
- `brand-master.md` Anti-patterns section complete (5-15 rules)
- `learnings.jsonl` seeded with brand-specific anti-pattern rules

---

## Phase 7 — Synthesis & Commit

Generate the final `brand-master.md` in full. Show it to the user as a single document:

```
브랜드 헌법 완성됐어요. 한번 쭉 읽어보세요:

[brand-master.md 전체 출력]

이대로 등록할까요? 아니면 수정할 부분?
```

After approval, finalize:

1. Append v1.0 entry to `evolution.md`:
   ```markdown
   ## v1.0 — 2026-05-28 — Initial registration

   **Mood:** sticker-kawaii + iso-3d-gradient hybrid
   **Signature motifs:** logo, paperclip, folder-card, iso-disc
   **Universal idioms locked:** all 8
   **Composition patterns:** locked
   **Anti-patterns:** 7 rules captured

   Established by Tom (tom.kim@balancehero.com) via card-designer skill.
   ```

2. Append `onboarded` event to `timeline.jsonl`
3. Append onboarding learnings to `learnings.jsonl`
4. Update `taste-profile.json` `lastUpdated`
5. Emit `═══ SESSION COMPLETE ═══` block

### Final user message

```
브랜드 '{name}' v1.0 등록 완료.

축적된 자산:
- 시그니처 SVG: N개 (logo, paperclip, ...)
- Universal idioms: 8개
- Anti-patterns: M개
- Composition patterns: 잠금

이제 주제만 주시면 이 모든 자산을 자동으로 적용해서 카드뉴스 만들 거예요.
브랜드는 세션이 쌓일수록 자동으로 깊어집니다 (반복 모티프 → signature 승격,
반복 패턴 → rule 승격).
```

---

## brand-master.md template (the constitution file)

When AI writes `brand-master.md`, follow this structure:

```markdown
# {Brand Name} — Brand Master

> **Living document.** Updated through usage. Snapshot of brand grammar as of v{N}.

## Essence

{1 paragraph: what this brand is, who it serves, what makes it different.
 Direct quote from user when possible.}

## Voice

- **Adjective set (3):** {user-picked}
- **User's exact words:** "{verbatim quote}" — 2026-05-28
- **Avoid tones:** {what user said}

## Forensics (if Existing Brand)

| Dimension | Value | Confidence |
|---|---|---|
| Mood | sticker-kawaii + iso-3d-gradient | 0.8 |
| Light source | top-left 30° | 0.7 |
| Palette | #F05A2A (45%), #0A0604 (25%), #FFB489 (15%), #FFFFFF (15%) | 0.8 |
| Geometric grammar | rounded — scalloped, soft curves | 0.7 |
| Stroke stance | mixed (logo outlined-bold, motifs solid-fill) | 0.7 |

## Master Vocabulary

Signature SVGs in `assets/signature/` and `assets/logo.svg`:

- `logo.svg` — {1 line description}
- `paperclip.svg` — {1 line description}
- `folder-card.svg` — {1 line description}
- `iso-disc.svg` — {1 line description}

## Visual Idioms

Concrete expression patterns. Machine-readable copy lives in `idioms.json`.

- **Emphasis:** {idiom description + visual example reference}
- **Divider:** {...}
- **List item:** {...}
- **Data anchor:** {...}
- **Callout:** {...}
- **Success feel:** {...}
- **Container:** {...}
- **Background texture:** {...}

## Composition Patterns

- **Cover:** {title position} + {signature object position}
- **Detail:** {container choice}
- **List:** {layout pattern}
- **Data:** {layout pattern}
- **CTA:** {layout pattern}
- **Brand mark:** {position rule, slides applied}
- **Slide indicator:** {format}

## Voice-Visual Coupling

- Korean weight scale: {Pretendard X / Y / Z}
- Emphasis treatment: {color X or box Y, not both}
- English tracking: {letter-spacing rule}
- Body forbiddens: {what never appears in body text}

## Anti-Patterns (Brand-Specific)

{Numbered list of "never do X" rules, captured verbatim from user.}

## Evolution

See `evolution.md`. Current version: v1.0.
```

---

## Designer heuristics reflected throughout

The questions in this protocol are calibrated to extract what real brand designers extract:

- **Verbatim quotes** preserved as the brand's voice
- **Negative examples** ("what you don't want to look like") often clearer than positives
- **Forensic inference** before asking — never ask a question the assets already answer
- **Sample-first decisions** for visual choices, prose-first for strategic choices
- **Anti-patterns explicit** — what to avoid is as load-bearing as what to do
- **Coupling rules** — voice and visual are not separate axes, they constrain each other
- **Idioms** — brands repeat themselves; codify the repetitions
- **Living, not frozen** — `evolution.md` ensures the brand can grow without becoming inconsistent

---

## Skip rules

The user can compress. If they say "빠르게", you may compress phases:

- Phase 1: ask the mandatory message + 0 follow-ups (instead of 2-3)
- Phase 2: SVG-ize assets but skip the public 5-dimension presentation (still capture internally)
- Phase 4 Step 4.2: walk through 4 idioms instead of 8 (emphasis, divider, list-item, container)
- Phase 5: 1-slide sample instead of 3-slide series
- Phase 6: ask only "절대 안 됐으면 하는 것 3가지만"

**Phases 3 (mood lock) and 7 (synthesis commit) are non-skippable.** They produce the structural files.
