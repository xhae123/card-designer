# Font Presets — Font Recommendations by Brand Tone

## Usage Rules

1. Always distinguish between Display (title) and Body (body text) fonts
2. Use a maximum of 2 font families per card news
3. Create hierarchy through weight variation (instead of adding more families)
4. When English text is included, an English-only font can be paired for display

---

## Preset 1: Professional / Modern

Clean, trustworthy tone. Suitable for tech, business, and education content.

### Pretendard (Recommended default)

- **Source:** CDN (cdn.jsdelivr.net)
- **@import:**
  ```css
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  ```
- **Display:** Pretendard, weight 700-800
- **Body:** Pretendard, weight 400-500
- **Features:** Variable font, excellent for both Korean and English, safest choice

### Noto Sans KR

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
  ```
- **Display:** Noto Sans KR, weight 700-900
- **Body:** Noto Sans KR, weight 400-500
- **Features:** Google default, versatile, slightly wider letter-spacing

### Wanted Sans

- **Source:** CDN (cdn.jsdelivr.net)
- **@import:**
  ```css
  @import url('https://cdn.jsdelivr.net/gh/niceplugin/wantedsans/packages/wanted-sans/fonts/webfonts/variable/complete/WantedSansVariable.min.css');
  ```
- **Display:** "Wanted Sans", weight 700-800
- **Body:** "Wanted Sans", weight 400-500
- **Features:** Made by Wanted Lab, modern and geometric, strong tech feel

---

## Preset 2: Emotional / Warm

Soft, human tone. Suitable for lifestyle, F&B, beauty, and emotional content.

### Cafe24 Surround Air

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Cafe24+Surround+Air&display=swap');
  ```
- **Display only:** "Cafe24 Surround Air", weight 400
- **Body pairing:** Pretendard or Noto Sans KR weight 400
- **Features:** Rounded, soft feel, display-only (insufficient readability for body text)

### Gowun Dodum

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
  ```
- **Display & Body:** "Gowun Dodum", weight 400
- **Features:** Soft gothic, friendly yet readable, usable for both display and body

### Nanum Myeongjo

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
  ```
- **Display:** "Nanum Myeongjo", weight 700-800
- **Body:** "Nanum Myeongjo", weight 400
- **Features:** Emotional serif, suitable for essays and emotional content

---

## Preset 3: Impact / Bold

Strong, eye-catching tone. Suitable for marketing, events, sports, and news content.

### GMarket Sans

- **Source:** CDN
- **@import:**
  ```css
  @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.css');
  ```
- **Display:** "GmarketSans", weight Bold
- **Body pairing:** Pretendard weight 400-500
- **Features:** Bold, impactful gothic, strong for marketing
- **Note:** Only Bold is available via CDN. For Medium/Light, use full load below:
  ```css
  @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.css');
  ```

### Black Han Sans

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
  ```
- **Display only:** "Black Han Sans", weight 400
- **Body pairing:** Noto Sans KR or Pretendard weight 400
- **Features:** Extremely bold gothic, maximum impact, display-only

### Montserrat + Pretendard (English heading combination)

- **Source:** Google Fonts + CDN
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  ```
- **Display (English):** "Montserrat", weight 700-900
- **Display (Korean):** Pretendard, weight 700
- **Body:** Pretendard, weight 400
- **Features:** Suitable for content with English headings, global feel

---

## Preset 4: Classic / Premium

Refined, prestigious tone. Suitable for finance, real estate, luxury, and cultural content.

### Noto Serif KR

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;700;900&display=swap');
  ```
- **Display:** "Noto Serif KR", weight 700-900
- **Body:** "Noto Serif KR", weight 400-500
- **Features:** Refined serif, premium and authoritative, the typeface itself creates atmosphere

### Playfair Display + Pretendard (English heading combination)

- **Source:** Google Fonts + CDN
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  ```
- **Display (English):** "Playfair Display", weight 700-900
- **Display (Korean):** Pretendard, weight 700
- **Body:** Pretendard, weight 400
- **Features:** Classic serif + modern gothic combination, premium content

### Cormorant Garamond + Noto Serif KR

- **Source:** Google Fonts
- **@import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Noto+Serif+KR:wght@400;700&display=swap');
  ```
- **Display (English):** "Cormorant Garamond", weight 600-700
- **Display (Korean):** "Noto Serif KR", weight 700
- **Body:** "Noto Serif KR", weight 400
- **Features:** The most classic combination, magazine/editorial feel

---

## Pairing Principles

### Safe Combinations

| Display | Body | Tone |
|---|---|---|
| Pretendard 700 | Pretendard 400 | Modern/universal |
| Noto Serif KR 700 | Noto Sans KR 400 | Premium/trust |
| GMarket Sans Bold | Pretendard 400 | Impact/marketing |
| Montserrat 800 | Pretendard 400 | Global/tech |
| Cafe24 Surround Air | Pretendard 400 | Emotional/warm |
| Black Han Sans | Noto Sans KR 400 | Maximum impact |
| Playfair Display 800 | Pretendard 400 | Premium |

### Prohibited Combinations

- Serif + Serif (Noto Serif KR + Nanum Myeongjo) — conflict
- Rounded gothic + Rounded gothic (Cafe24 + Gowun Dodum) — indistinguishable
- 3+ font families simultaneously — visual chaos
- Display/body combination with weight difference under 200 — unclear hierarchy

### Weight Hierarchy Rules

```
Display (title):   weight 700-900    font-size 48-72px
Subtitle:          weight 600-700    font-size 28-36px
Body:              weight 400-500    font-size 20-26px
Caption:           weight 400        font-size 16-18px
```

The size ranges above are based on a 1080x1080px canvas.
