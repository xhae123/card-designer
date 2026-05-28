# card-designer

> 카드뉴스를 만드는 스킬이 아니라, **브랜드 디자인 시스템을 시간으로 축적하는 도구**예요. 한 번 쓰면 카드 한 세트가 나오고, 열 번 쓰면 그 브랜드만의 고유한 시각 언어가 남아요.

---

## 무엇인가요

`card-designer`는 Claude Code skill이에요. 인스타그램용 1080×1080 카드뉴스 시리즈를 동적으로 생성해요. 고정된 HTML 템플릿이 없어요. 매 세션마다 브랜드 토큰 + 축적된 grammar를 읽어서 HTML/CSS를 새로 써요.

핵심 산출물은 두 가지예요:

1. **카드 시리즈** — `slide_01.png` ~ `slide_NN.png` (puppeteer로 렌더링한 retina 2160px)
2. **브랜드 자산** — `brands/{name}/` 하위에 누적되는 `brand-master.md`, `idioms.json`, `manifest.json`, SVG 라이브러리

전자는 매번 새로 나오는 결과물이고, 후자는 영원히 남아 다음 세션을 더 정확하게 만들어요.

---

## 왜 다른가요 (Moat Thesis)

대부분의 "카드뉴스 생성기"는 표면 토큰(색, 폰트, 간격)만 다뤄요. 그건 누구나 복제할 수 있어요. 색 코드는 스크린샷 한 장이면 추출되니까요.

이 스킬은 다른 층위를 다뤄요 — **브랜드 grammar**:

- **Master Vocabulary** — 이 브랜드를 이루는 시그니처 SVG들 (로고, 마스코트, 모티프). 한 번 그려두면 byte-identical로 재사용.
- **8개 Universal Idioms** — emphasis / divider / list-item / data-anchor / callout / success-feel / container / background-texture. 각 브랜드마다 다르게 표현돼요. "강조"는 어떤 브랜드는 검은 박스, 어떤 브랜드는 형광펜이에요.
- **Composition Patterns** — cover는 왼쪽 정렬, detail은 라벨→타이틀→디바이더 순서, 같은 식의 공간 문법.
- **Voice-Visual Coupling** — "친근함"이 그라데이션으로 표현되는지, 둥근 모서리로 표현되는지, 사자 마스코트로 표현되는지.

표면 토큰은 5분이면 복사돼요. Grammar는 사용자가 디자이너(AI)와 함께 여러 세션에 걸쳐 만든 결정의 누적이에요. **복제 비용 = 그 시간을 다시 쓰는 비용.**

브랜드를 오래 쓸수록 자산이 쌓이고, 자산이 쌓일수록 다른 도구로 옮기기 어려워져요. 그게 moat예요.

---

## 빠른 시작

### 1단계 — 스킬 호출

Claude Code에서 트리거 표현을 쓰면 돼요.

```
카드뉴스 만들어줘
인스타 카드뉴스 디자인해줘
card designer
```

### 2단계 — 첫 방문: Brand Onboarding (15분)

처음이면 7-phase 온보딩이 시작돼요. Discovery → Forensics → Mood Lock → Master Vocabulary + Idioms + Composition + Coupling → Sample Validation → Anti-pattern Capture → Synthesis. 길어 보이지만, 이게 평생 자산이 돼요. 자세한 건 `references/onboarding-protocol.md` 참고.

기존 브랜드가 있으면 (로고/스크린샷 업로드) Forensic path로, 새 브랜드면 Mood Shotgun path로 분기돼요.

### 3단계 — 두 번째부터: 토픽만 던지기

```
"백엔드 스터디 모집 공지 카드뉴스 7장 만들어줘"
```

브랜드 컨텍스트는 자동 로드돼요. 토픽-무드 정합성 체크 → 콘텐츠 구조화 → 슬라이드별 asset planning → HTML 생성 → puppeteer 렌더 → 미리보기 열기까지 흐름이 이어져요.

---

## 디렉토리 구조

```
card-designer/
  SKILL.md                          # 메인 워크플로우 (우선 로드)
  scripts/
    render.js                       # Puppeteer 렌더러 (overflow detect + retry)
    validate.js                     # HTML validator
  references/                       # 항상/지연 로드되는 원칙 문서들
    asset-language.md               # WHEN/HOW assets, SVG-first rule, Discipline vs Flexibility
    asset-moods.md                  # 12-mood SVG 기법 deep-dive (lazy-load)
    asset-handling.md               # 인라인 SVG 강제, raster→SVG 변환 프로토콜
    onboarding-protocol.md          # 7-phase 브랜드 킥오프 (lazy-load)
    canvas.md / typography.md / layout.md / color.md / card-types.md
    content-principles.md / font-presets.md / visual-effects.md
    anti-patterns.md                # 24-item self-verification checklist
    quality-gates.md                # 하드 리미트 (NON-NEGOTIABLE)
    external-references.md          # WebFetch 디자인 레퍼런스 (4-fetch cap)
  brands/
    {brand-name}/
      taste-profile.json            # 표면 토큰 (color/font/spacing + assetLanguage)
      brand-master.md               # 헌법. voice/essence/vocabulary/idioms/patterns/anti-patterns
      idioms.json                   # 머신 리더블 idiom snippets
      evolution.md                  # append-only 브랜드 진화 로그 (v1.0, v1.5, ...)
      manifest.json                 # asset 인덱스 (tier/tags/usage/budget/contextFit)
      learnings.jsonl               # 학습 로그 (approved/rejected/rule/override)
      timeline.jsonl                # 세션 이벤트 타임라인
      assets/
        logo.svg                    # raster든 SVG든 결국 SVG로 변환된 결과물
        signature/                  # tier 1: 브랜드 식별 모티프 (byte-identical 재사용)
        library/                    # tier 2: 사용으로 획득된 재사용 SVG
        raw/                        # 원본 업로드 (forensic, 보존용)
      output/{YYYYMMDD_HHmm}/       # 생성된 슬라이드 + PNG
```

---

## 핵심 개념

### Brand Master — 헌법

`brand-master.md`는 단순한 메모가 아니라 브랜드의 헌법이에요. 매 세션 시작에 통째로 로드돼서 디자인 의사결정의 기준이 돼요. 섹션:

- **Essence** — 한 문장으로 이 브랜드는 무엇인지
- **Voice** — 형용사 3개, 피할 톤
- **Forensics** — (기존 브랜드의 경우) 자산에서 추출한 5차원 (mood / light source / palette / geometry / stroke stance)
- **Master Vocabulary** — 시그니처 SVG 목록 + 각 역할
- **Visual Idioms** — emphasis/divider/list-item/data-anchor/callout/success-feel/container/background-texture 각각의 표현 방식
- **Composition Patterns** — 슬라이드 역할별 공간 문법
- **Voice-Visual Coupling** — voice 형용사가 시각 결정과 어떻게 연결되는지
- **Anti-patterns** — 이 브랜드에서 절대 하지 말 것

### Asset Language — SVG-First 자산 시스템 (두 프로토콜)

`references/asset-language.md`에 자세해요. 핵심만:

**SVG-only, 하지만 두 가지 경로:**

- **Protocol A — 사용자 자산 인테이크.** 사용자가 PNG/JPG (로고, 마스코트, 사진)를 주면 `scripts/png-to-svg.py`로 **pngquant 압축 → base64 임베드**해서 SVG 래퍼에 넣어요. **픽셀 완벽** — Figma/Canva가 비-벡터 레이어를 SVG export 할 때 쓰는 방식. 손-트레이스나 vtracer/potrace는 큐트 일러스트의 그라데이션을 posterize 시켜서 못 써요.
- **Protocol B — AI 생성 자산.** 브랜드 mood에 맞춰 새로 그리는 자산(페이퍼클립, 캘린더 아이콘 등)은 `<path>`, `<radialGradient>` 등으로 **손-크래프트 pure SVG**. 편집 가능, 재색칠 가능, <5KB.
- 두 프로토콜을 절대 섞지 말 것 — 사용자 마스코트는 무조건 A, AI 신규 모티프는 무조건 B.

**렌더 제약.** Puppeteer `setContent`라서 상대 경로 통하지 않음. 인라인 SVG만.

**세 단계 tier.** `signature/` (브랜드 식별 모티프, byte-identical 재사용) / `library/` (사용으로 획득된 재사용 자산) / `raw/` (원본 보존).

**WHEN matrix.** 슬라이드 역할(cover/detail/list/...)별로 자산 슬롯, 캔버스 비율, 기본 배치가 정해져 있어요.

**12 Mood Library.** `asset-moods.md`에 toss-flat, sticker-kawaii, iso-3d-gradient, memphis-revival, editorial-line, architectural-blueprint, notion-doodle, neo-brutalist, claymorphism, paper-cutout, pixel-art, y2k-vaporwave. 각 mood에 copy-paste SVG 스니펫 + 조명/색 규칙 포함. Lazy-load.

### Visual Critique Loop — 추함을 잡는 단계

두 단계로 작동해요.

**[10.7] Self-Critique (항상 실행).** `references/visual-critique.md`. 9개 차원 구조화 비평:
hierarchy / color / breathing / typography / cohesion / cover-dominance / asset-balance / AI-smell / brand-alignment

각각 `pass/minor/fail` 채점. `1 fail` 또는 `5+ minors` 면 retry (슬라이드당 max 2회). 시리즈 40%가 retry면 brand-grammar 문제로 보고 사용자에게 surface.

**[11.5] Designer Reviewer (opt-in).** `references/designer-reviewer.md`. self-critique의 구조적 blind spot(자기 작업을 자기가 평가)을 외부 시선으로 보완해요. 사용자가 동의하면 시니어 브랜드 디자이너 페르소나 에이전트가 렌더된 PNG를 cold로(생성 컨텍스트 없이) 리뷰. gstack의 codex review 패턴. 30-60초 추가 비용, 고밀도 폴리시가 필요할 때만 사용.

### Discipline vs Flexibility

규칙을 만들면 굳어버려서 모든 시리즈가 똑같아지는 함정이 있어요. `asset-language.md §6.5`에서 6개 메커니즘으로 균형을 잡아요:

1. **Enforcement levels** — `hard` / `default` / `suggestion`. hard만 절대 규칙.
2. **Per-series asset budget** — 마스코트 ≤2회, signature container ≤3회, 같은 idiom ≤4회 식의 캡.
3. **Context-fit check** — 슬라이드 콘텐츠가 그 자산을 실제로 요구하는지 매번 확인. 진지한 공지에 큐트 마스코트는 안 돼요.
4. **Fresh-element imperative** — 새 토픽이 새 개념을 가져오면 새 SVG를 만들어 `library/`에 추가. 브랜드는 매 시리즈 자라요.
5. **Deliberate-deviation logging** — `default` 규칙을 깨면 `learnings.jsonl`에 `type: override` + 이유.
6. **Topic-mood pre-check** — 사용자 토픽이 브랜드 locked mood와 충돌하면 surface하고 선택권을 줘요 (one-series exception vs force-fit).

### Living Document

매 세션이 브랜드를 갱신해요:

- **Confidence updates** — 승인된 토큰 +0.15, 거부된 토큰 -0.2, 1주 미사용 시 ×0.95 decay.
- **Rule promotion** — 같은 패턴이 3회 이상 반복되면 `learnings.jsonl`에 `type: rule`로 승격, 다음 세션부터 자동 적용.
- **Evolution log** — `evolution.md`에 버전 단위로 append (v1.0 → v1.5 → ...).
- **Timeline** — `timeline.jsonl`에 세션 이벤트 (onboarded, series_generated, profile_edit, rule_promoted).

---

## 한계 (솔직히)

이 스킬은 v1.0이에요. 작동하지만 다음 문제들이 있어요.

- **Visual critique은 두 층.** Self-critique [10.7]가 항상 돌고, Designer reviewer [11.5]가 opt-in으로 외부 시선을 더해요. self-critique의 blind spot은 reviewer로 보완하지만, 두 층 모두 객관 평가가 아닌 모델 판단이라 사용자 최종 검수는 여전히 load-bearing.
- **12-mood이 출발점일 뿐이에요.** sticker-kawaii + iso-3d-gradient를 섞는 식의 하이브리드는 다루지만, 12개 카테고리에 잘 안 떨어지는 결(예: 한국적 모던, 의료 신뢰감, 종교/의식)은 강제 매핑돼요. Mood library는 사용자 피드백으로 확장돼야 해요.
- **Onboarding이 길어요.** 7-phase는 15-20분 걸려요. 사용자가 brand grammar의 가치를 모르는 첫 만남에서는 부담스러울 수 있어요. "집요하게 조사" 규칙은 푸시백 1회 후 압축을 허용하지만, 그러면 grammar 깊이가 얕아져요. 트레이드오프 미해결.
- **Idiom 자동 추출이 없어요.** `idioms.json`은 onboarding Phase 4에서 사람이 디자이너(AI)와 같이 정의해요. 기존 자산에서 idiom을 자동 패턴 마이닝하는 기능은 없어요.
- **렌더링은 단일 puppeteer 인스턴스.** 10장 시리즈가 직렬 렌더링되면 30-60초 걸려요. 병렬화 안 됨.
- **다국어.** 한국어/영어 word-break, 폰트 프리셋은 있지만 일본어/중국어/아랍어 등은 검증 안 됨.
- **Asset reuse를 강제하지 않아요.** Asset Planning step에서 signature/library 우선 체크를 하지만, 모델이 fresh generation으로 흐르는 경향이 있어요. budget cap이 견제하지만 완벽하지 않아요.

---

## 현재 상태

**버전:** v1.0 (2026-05-28 아키텍처 오버홀)

**오늘 들어온 것:**
- SVG-first 자산 시스템 (signature/library/raw 3-tier)
- Brand-master 시스템 (brand-master.md + idioms.json + evolution.md + manifest.json + timeline.jsonl)
- 7-phase onboarding protocol (기존 4-phase quick onboarding 대체)
- Asset language reference (WHEN/HOW + Discipline vs Flexibility)
- 12-mood library (lazy-loaded)
- Topic-Mood Alignment Check (Step [4.5]) + Asset Planning (Step [6.5])
- **Two-protocol asset intake** — Protocol A (사용자 PNG → pngquant + base64-embed SVG, 픽셀 완벽) + Protocol B (AI 신규 모티프 → 손-크래프트 pure SVG). `scripts/png-to-svg.py` 헬퍼 추가.
- **Visual Critique Loop** (Step [10.7]) — 9차원 구조화 비평 + retry 로직 (`references/visual-critique.md`).
- **Opt-in Designer Reviewer** (Step [11.5]) — 시니어 브랜드 디자이너 페르소나 에이전트가 렌더된 PNG를 cold 리뷰. gstack 패턴, 사용자 트리거 (`references/designer-reviewer.md`).

**다음 우선순위:**

1. Mood library 확장 — 사용자 작업에서 새 mood 결을 발견했을 때 brand의 `assetLanguage.mood` 값에 커스텀 mood 등록 경로.
2. Onboarding 압축 path — grammar 깊이를 유지하면서 5-7분 안에 끝내는 모드 (Phase 2/4를 후속 세션으로 미루기).
3. Idiom 자동 추출 — 기존 카드뉴스 이미지에서 emphasis/list/divider 패턴 자동 인식.
4. Vectorizer.AI API 통합 — Protocol A의 옵션 escape hatch ($0.20/장, 진짜 path-편집 가능 vector 필요할 때).
5. 다른 카드 포맷 — 1:1 외에 4:5, 9:16 (스토리), 가로형 지원.

---

## 참고

- 워크플로우 전체: `SKILL.md`
- 자산 철학: `references/asset-language.md`
- 온보딩 깊이: `references/onboarding-protocol.md`
- 무드 라이브러리: `references/asset-moods.md`
- 작동 중인 예시 브랜드: `brands/khu-likelion/` (멋쟁이사자처럼 경희대)

이슈/피드백은 Tom에게 직접. 이 스킬은 사용자와 디자이너 사이의 대화로 자라요 — README도 그래요.
