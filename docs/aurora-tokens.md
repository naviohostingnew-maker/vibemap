# VibeMap · Aurora Design Tokens

> Aurora = единая эстетика VibeMap на весь Sprint 1+. Этот файл — **источник истины** для CC. Любое отступление от tokens требует update этого файла first.
>
> **Восстановлен 21.05 из past chat (Sprint 1.1.C от 20.05) + active claude_state decisions.** Если что-то расходится с твоим оригиналом в Downloads/Desktop — пиши, синхронизируем.

---

## 1. Color palette

### Background (gradient mesh — задаётся на `<body>` или auth/onboarding layout)
```css
background-color: #fef5ee;
background-image:
  radial-gradient(70% 50% at 20% 0%,   #ffcfe0 0%, transparent 60%),
  radial-gradient(60% 50% at 100% 30%, #ffd6a8 0%, transparent 55%),
  radial-gradient(80% 60% at 50% 110%, #d4d6ff 0%, transparent 55%);
```

| Token | Hex | Назначение |
|---|---|---|
| `--bg-cream` | `#fef5ee` | Базовый фон, paper-tone |
| `--bg-pink` | `#ffcfe0` | Mesh blob top-left |
| `--bg-peach` | `#ffd6a8` | Mesh blob top-right |
| `--bg-lilac` | `#d4d6ff` | Mesh blob bottom |

### Foreground (ink scale)
| Token | Hex | Назначение |
|---|---|---|
| `--ink` | `#2a1832` | Primary text, CTA fill, фокус-обводки |
| `--ink-70` | `#2a183299` | Secondary text, описания, hints |
| `--ink-50` | `#2a183280` | Tertiary, поэтика, "ground-tone" |
| `--ink-30` | `#2a183240` | Декоративные линии, dividers, soft underlines |
| `--rose-deep` | `#6b2e4d` | Текст на pill'ах, italic-категории, "Volly speaks" tone |

### Accent (gradient на ОДНО italic-слово в заголовках — **не более одного на экран**)
```css
background: linear-gradient(110deg, #d4537e 0%, #ef9f27 100%);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```
| Token | Hex | Назначение |
|---|---|---|
| `--accent-magenta` | `#d4537e` | Gradient start |
| `--accent-orange` | `#ef9f27` | Gradient end |

Тот же gradient допустим как fill для прогресс-баров и **brand-dot** (9×9 круг возле логотипа в шапке).

---

## 2. Typography

### Font stack (next/font)

Шрифты подключаются через `next/font/google` в `app/layout.tsx` — не ручным `<link>` (next/font сам делает preconnect + self-host оптимизацию).

| Family | Загрузчик | Subsets | Weights |
|---|---|---|---|
| Playfair Display | next/font/google | latin, latin-ext, cyrillic | 400 / 500 / 600 / 700 + italic |
| Manrope | next/font/google | latin, cyrillic | 300 / 400 / 500 / 600 |

⚠️ Playfair Display — subset **cyrillic-ext НЕ подключать**: Google Fonts не отдаёт его для этого семейства, next/font падает на build (Unknown subset). Базовый cyrillic (U+0400–04FF) полностью покрывает русский язык — основной кейс продукта. Manrope latin-ext — отложен в backlog 0.1.3 (выравнивание сабсетов с Playfair).

### Roles
| Role | Family | Weight | Use |
|---|---|---|---|
| Display | **Playfair Display** | 400 / 500 / 600 / 700 | H1/H2, акценты, поэтические фразы, категории-капсулы |
| Body | **Manrope** | 300 / 400 / 500 / 600 | Кнопки (600), label (500), параграфы (400), light hints (300) |
| Italic display | Playfair Display italic | 400 | accent-word с gradient, brand "Volly" в копи |

### Scale (мобильный фокус, 375px base)
| Token | Size / line-height | Где |
|---|---|---|
| `display-xl` | 46px / 1.0 | Welcome H1, Reveal title |
| `display-lg` | 32px / 1.08 | Question H1 («В пятницу вечером ты *скорее*...») |
| `display-md` | 24px / 1.1 | Section heading |
| `body-lg` | 16px / 1.55 | Описание под H1 |
| `body` | 14px / 1.55 | Карточки ответов, основной текст |
| `body-sm` | 13px / 1.5 | Brand, progress, hints |
| `caption` | 12px / 1.4 | Foot links, "сохранить как обои" |
| `micro` | 11px / 1.3 | Категории-капсулы (italic), letter-spacing 0.04em |

### Правила
- Только **один** accent-italic-gradient на экран — иначе теряется акцент.
- **Никогда** не использовать `font-weight: 700` для Manrope — слишком тяжело для Aurora. Maximum 600.
- Playfair Display: основной вес — 400 (italic 400 — для accent-word gradient); веса 500/600/700 доступны для точечного усиления, не по умолчанию.
- Lowercase в заголовках допустим если это часть стиля экрана; default = sentence case.

---

## 3. Spacing & radii

### Radii
| Token | Value | Use |
|---|---|---|
| `r-card` | `16px` | Карточки ответов 20Q, secondary surfaces |
| `r-portrait` | `24px` | Portrait image в reveal |
| `r-pill` | `999px` | Кнопки, pill'ы, glass-капсулы категорий |
| `r-input` | `12px` | Текстовые поля |

### Spacing (Tailwind-compatible)
- Внутренний padding экрана: `28px 26px` (top/bottom × left/right)
- Gap между секциями экрана: `22px–28px` (mood-зависимо)
- Gap между карточками ответов: `9px` (плотно, чтобы 4 варианта влезли)
- Внутренний padding карточки ответа: `14px 16px`
- Padding кнопки CTA primary: `18px 24px`

---

## 4. Surfaces — glass cards

### Glass card (основная поверхность контента поверх Aurora mesh)
```css
background: #ffffffb0;   /* decorative/empty glass — text-heavy: см. split ниже */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid #ffffff;
border-radius: var(--r-card);  /* 16px */
```

Text-heavy карточки (Welcome, 20Q) — та же рецептура, меняется только `background` на `#ffffffd0`; blur, border и radius идентичны.

### Alpha split по контексту

Заливка glass-карточки выбирается по типу контента. Backdrop-blur, белая рамка и radius — одинаковые в обоих вариантах.

| Token | Value | Контекст |
|---|---|---|
| `--glass-bg` | `#ffffffb0` | Decorative / empty / ambient glass — Aurora PoC, фоновые поверхности, карточки без длинного текста (alpha ~69%) |
| `--glass-bg-strong` | `#ffffffd0` | Text-heavy — Welcome, карточка 20Q, любая card с substantial body copy (alpha ~82%, читаемость поверх mesh) |
| `--glass-blur` | `10px` | Backdrop blur strength |
| `--glass-border` | `#ffffff` | Чистая белая 1px рамка |

### Правила glass
- Glass card **никогда** не должен сидеть прямо на cream-фоне без mesh — теряется эффект. Всегда поверх минимум одной видимой mesh-blob.
- `backdrop-filter` дорогая по перфомансу — не больше **3 glass-карточек одновременно** на экране.
- На Safari iOS добавь `-webkit-backdrop-filter` обязательно — без него blur не работает.
- Выбор заливки: substantial body copy (вопросы, параграфы, длинный текст) → `--glass-bg-strong` (#d0); decorative / ambient / короткие поверхности → `--glass-bg` (#b0). Карточка 20Q = text-heavy → #d0.

---

## 5. CTA — pill button

### Primary CTA (ink, плотный)
```css
background: var(--ink);  /* #2a1832 */
color: white;
font-family: var(--font-body);  /* Manrope */
font-weight: 600;
font-size: 16px;
padding: 18px 24px;
border-radius: var(--r-pill);  /* 999px */
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms;
```

- **Hover:** `transform: scale(1.02)` + soft shadow `0 4px 16px rgba(42,24,50,0.18)`
- **Active:** `transform: scale(0.98)`
- **Focus:** outline `2px solid var(--accent-magenta)`, offset `2px`

### Secondary / tertiary (если нужно)
- Outlined: `1px solid var(--ink-30)`, фон `transparent`, текст `--ink`
- Ghost: фон `transparent`, текст `--ink-70`, hover → `--ink`

### Правила
- На один экран — **один primary CTA**. Если кажется что нужны два — пересмотри иерархию.
- CTA copy должен быть energy ("Поехали", "Начать", "Дальше"), а не транзакционным ("Продолжить", "Отправить").

---

## 6. Brand mark

### Brand-dot
9×9 круг с accent-gradient, сидит слева от "VibeMap" wordmark в шапке.

```css
width: 9px;
height: 9px;
border-radius: 50%;
background: linear-gradient(110deg, var(--accent-magenta), var(--accent-orange));
```

### Wordmark
- Family: **Playfair Display** italic
- Weight: 400
- Size: 22px / line-height 1.0
- Letter-spacing: -0.02em
- Color: `--ink`
- Cap "V" в "VibeMap" — non-italic, остальные буквы italic (если технически возможно через `<em>` wrap)

---

## 7. Component pattern — `<AccentWord>`

Утилитарный компонент для подсветки одного слова/фразы gradient italic в любом тексте:

```tsx
<AccentWord text="Привет, я Volly." accent="Volly" />
```

### Поведение
- Split текста на `before` + `accent` + `after` по первому case-sensitive вхождению.
- Рендер: `<span>{before}<em className="accent-word">{accent}</em>{after}</span>`
- Стиль `.accent-word`: Playfair Display italic + accent gradient на background-clip:text.
- Edge case: если `accent` не найден в `text` — `console.warn` в dev, рендер `text` без эффекта.

### Где используется
- Welcome H1 (имя Volly)
- 20Q вопросы (по `accent_word` из БД)
- Reveal title (vibe-тип одним словом)
- Любые места с одной "светящейся" фразой

---

## 8. Animation tokens (draft — подтверди если используем framer-motion)

Базовые ориентиры для motion в Aurora:

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | UI hover, transitions |
| `--ease-spring` | `framer-motion spring { stiffness: 280, damping: 28 }` | Page enter, card appear |
| `--dur-fast` | `150ms` | Hover micro |
| `--dur-base` | `300ms` | Card transitions, modal open |
| `--dur-slow` | `600ms` | Mesh-blob breathing, Aurora ambient |

### Aurora ambient motion (low priority, добавляется в Sprint 1.3+)
Mesh blobs медленно «дышат» — `radial-gradient` позиции анимируются с периодом 30s, амплитуда 5–10% viewport. Это subtle ambient полировка, не нужна в Sprint 1.2.

---

## 9. Volly tone — references для копи

Volly = проактивный AI-спутник с памятью (см. claude_state decision от 21.05). Это не voiceover, а персонаж.

### Голос
- Genderless ("Volly думает / собрал / увидел" — без он/она)
- Тёплый italic-friendly, не корпоративный
- Использует first person ("я подсказываю", "я учусь тебя понимать")
- Указывает на свой рост ("чем больше я узнаю...", "со временем я начну...")

### Где имя Volly появляется
- Welcome screen — впервые, через AccentWord ("Привет, я Volly.")
- Reveal — Volly комментирует результат ("Volly увидела в тебе...")
- Feed (Sprint 1.3) — подсказки с подписью "Volly предлагает"
- НЕ в 20Q-вопросах — там голос вопросов = неявно голос Volly

### Маркетинговая ось
Каждая точка касания Volly должна нести УТП «AI, который растёт с тобой». Это ключевой differentiator подписки.

---

## 10. Что в Aurora НЕ делать

- Drop shadows на UI элементах (тяжело для светлой эстетики; используем translucency + blur вместо)
- Жирные borders > 1px (если только не специальный focus state)
- Чёрный pure `#000` (нарушает ink-tone — всегда `--ink: #2a1832`)
- Тяжёлый Playfair Display (600/700) по умолчанию для display-текста — убивает воздушность Aurora. Default серифа = 400; веса 500–700 — только точечный акцент (см. §2).
- Несколько accent-gradient слов на одном экране
- Solid CTA не на ink-цвет
- Mesh-blob без cream базового фона (теряется paper-tone)
- Smooth scroll или parallax на onboarding screens (отвлекает от вопроса)
- Любые эмодзи в основных UI текстах (только в копи / Volly responses, если уместно)
