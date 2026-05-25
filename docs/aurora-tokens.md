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
| `display-xl` | mobile 32px / 1.1 → `lg:` 46px / 1.05 | Welcome H1, Reveal title (hero). **Responsive-вилка** через `lg:`-брейкпоинт (как D.0/C.1, не clamp): на 390px крупный 46px-заголовок в 3–4 слова рвётся на 3 строки — мобильный шаг 32px держит его в 1–2 строки, на `lg`+ возвращается к 46px hero. Текст заголовка НЕ режем под фикс-размер. |
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
- Внутренний padding экрана: `28px 26px` (top/bottom × left/right) — конвенция onboarding/`(auth)`-поверхностей; header-less `(app)`-shell поверхности (лента/я) задают собственный верхний воздух (напр. `pt-16`), горизонтальный `26px` сохраняют.
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

### Option button — выбираемая опция (онбординг 20Q)
Не CTA: тап = мгновенная запись ответа (instant submit). Состояния:

| Состояние | Border | Background | Индикатор |
|---|---|---|---|
| idle | `1px solid var(--ink-30)` | `#ffffff` alpha ~50% | — |
| hover | `1px solid var(--ink)` | `#ffffff` alpha ~80% | — |
| selected | `1px solid var(--ink)` | `#ffffff` solid | inline-SVG галочка справа |

- **Selected-галочка:** 16×16, `stroke: var(--ink)`, stroke-width 1.5, round caps/joins, `aria-hidden`. Это единственный признак, которого hover не порождает — однозначный дифференциатор selected ↔ hover.
- Выбранность — в семантике: `aria-pressed={true}` на `<button>`, не только пиксели.
- **accent-gradient на опции запрещён** — правило «один accent-gradient на экран» (§2/§10), он занят H2 accent-word вопроса.
- Без drop-shadow, border не толще 1px (§10).

### Input field — текстовое поле (login email и т.п.)
- Радиус: `var(--r-input)` (12px). Фон: solid `#ffffff` (на стекле — плотное поле, не glass).
- Border: idle `1px solid var(--ink-30)` → focus `1px solid var(--ink)`.
- Focus-visible: outline `2px solid var(--ink)`, offset `2px` (клавиатурный фокус; на мышином — только смена border).
- Текст: `--ink`, 16px Manrope. Placeholder: `--ink-50`. Padding: `14px 16px`. Без shadow.
- Ошибка: form-level inline текст `--rose-deep` (нового error-цвета не вводим).

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
- Genderless ("Volly думает / замечает / подсказывает" — настоящее/безличное, без он/она и без рода в прошедшем; согласовано с гендер-гардом движков 1.3.1.C/D)
- Тёплый italic-friendly, не корпоративный
- Использует first person ("я подсказываю", "я учусь тебя понимать")
- Указывает на свой рост ("чем больше я узнаю...", "со временем я начну...")

### Где имя Volly появляется
- Welcome screen — впервые, через AccentWord ("Привет, я Volly.")
- Reveal — Volly комментирует результат ("Volly подмечает в тебе...")
- Feed (Sprint 1.3) — реплика Volly в «Volly speaks»-блоке карточки: голый wordmark «Volly» + italic-комментарий о карте (как в Reveal-карте), без подписи-глагола
- НЕ в 20Q-вопросах — там голос вопросов = неявно голос Volly

> «Volly speaks»-блок (brand-dot §6 + wordmark «Volly» Playfair italic + italic-реплика `--rose-deep`) — общий визуальный паттерн RevealCard и карточек ленты; обязан оставаться идентичным в обоих местах (extraction в `<VollySpeaks>` — backlog 0.1.3).

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

---

## 11. Bottom navigation — таб-бар (app)-оболочки

> ⚠️ v0.2 (proto/usp): таб-бар расширен до 5 вкладок — см. §12. §11 описывает 2-табовый бар main v0.1.4; на proto/usp действует §12.

> Введён в Sprint 1.3.2.A. Нижняя навигация authed-поверхности `(app)`. Это **chrome, НЕ glass-карточка** — правила ниже отличаются от §4.

Полноширинный (full-bleed) стеклянный бар, закреплён внизу вьюпорта поверх mesh.

| Свойство | Значение | Примечание |
|---|---|---|
| Заливка | `--glass-bg-strong` (`#ffffffd0`) | §4 text-heavy fill — иконки+подписи должны читаться поверх mesh |
| Blur | `10px` | как все glass-поверхности §4 |
| Граница | hairline `1px` `--glass-border` (`#fff`) **только верхняя кромка** | НЕ рамка по периметру — это не карточка |
| Радиус | `0` | full-bleed, край-в-край; никакого `r-card` |
| Высота | `~64px` + `env(safe-area-inset-bottom)` | iOS home-indicator не наезжает на бар |
| Позиция | `fixed`, `inset-x-0 bottom-0` | контент (app)-страниц получает нижний паддинг ≥ высоты бара |

### Вкладки (v0.1.3 — ровно 2)

| Вкладка | Роут | Иконка (line, stroke 1.5) | Подпись |
|---|---|---|---|
| Лента | `/feed` | `Sparkles` (lucide) — AI-подобрано; **НЕ** `Compass` (Compass = Discovery, Sprint 2) | «Лента» |
| Я | `/me` | `User` (lucide) | «Я» |

### Состояния

- **active** — `--ink` (иконка + подпись) + акцентный пип (точка) `~5px` **над иконкой**, заливка accent-gradient (`linear-gradient(110deg, #d4537e, #ef9f27)` — тот же hue, что brand-dot §6). Активная вкладка определяется текущим роутом (`usePathname`).
- **inactive** — `--ink-30` (иконка + подпись), пип прозрачный (сохраняет выравнивание иконок).

Login и полный рестайл `/me` — отдельно в 1.3.x. Вкладки Discovery / Chat — Sprint 2 (не добавлять сейчас).

# VibeMap · Aurora — расширение v0.2 (вайб-соцсеть + Волли)

> §12–§20 вводятся на ветке `proto/usp` под прототип v0.2. Источник: UX/UI-спек
> (`claude_state` decision `related_to='ux-design'`) + макеты `docs/mockups/vibemap-v0.2-screens.html`.
> Макеты — wireframe-референс раскладки; **скин всегда из этого файла**, не из макета.

### Уточнение правила accent (важно — снимает ложный конфликт с §2/§10)

«Один accent на экран» из §2/§10 относится **только к accent-gradient на тексте**
(`background-clip:text`). Сплошной `--accent-magenta` как UI-цвет (заливки кнопок,
1px-обводки, иконки, активные чипы, центр-таб) ограничения по количеству **не имеет** —
это рабочий цвет интерфейса v0.2. Gradient-на-тексте по-прежнему ≤1 на экран.

### Новые токены v0.2

| Token | Value | Назначение |
|---|---|---|
| `--accent-tint` | `rgba(212,83,126,0.12)` | Розовая подложка чипов Волли и тега «по вайбу» (§16). Alpha — композитится поверх mesh/cream. |
| `--surface-volly` | `#ffffffcc` | Поверхность голосового баббла Волли и in-chat карточек (§14–15). Полупрозрачная, **без** backdrop-blur. |
| `--scrim` | `rgba(42,24,50,0.5)` | Затемнение под слайд-ап шитами/модалями (§17). Ink-тон, не чёрный (§10). |
| `--r-bubble` | `14px` | Базовый радиус голосовых бабблов (один угол схлопывается до 4px — см. §14). |

`--r-sheet` отдельно не вводим — верх шита = `r-portrait` (24px, §3).

---

## 12. Bottom navigation v0.2 — 5 разделов

> Заменяет §11 на `proto/usp`. Геометрия бара (full-bleed glass, blur 10px, hairline
> только верх, высота ~64px + `env(safe-area-inset-bottom)`, `fixed inset-x-0 bottom-0`,
> radius 0) — **без изменений из §11**. Меняется состав вкладок и центральный акцент.

### Вкладки (ровно 5, слева направо)

| Вкладка | Роут | Иконка (lucide, line, stroke 1.5) | Подпись |
|---|---|---|---|
| Лента | `/feed` | `Newspaper` | «Лента» |
| Каталог | `/catalog` | `Compass` | «Каталог» |
| **Волли** | `/volly` | `Sparkles` | «Волли» |
| Друзья | `/friends` | `Users` | «Друзья» |
| Я | `/me` | `User` | «Я» |

> **Переназначение иконок против §11 — намеренное.** §11 (v0.1) держал `Sparkles` на Ленте
> и резервировал `Compass` под Discovery/Sprint 2. В v0.2 Каталог *и есть* discovery-поверхность,
> а `Sparkles` — сквозной знак ИИ во всём продукте и потому уходит на центр-вкладку Волли.
> Лента берёт `Newspaper`. На `proto/usp` действует таблица выше.

### Центральная вкладка «Волли» — приподнятый акцент

- Кнопка-круг `52×52`, заливка сплошной `--accent-magenta`, иконка `Sparkles` белая `26px`.
- Белая обводка `3px` (`--glass-border`) — отрезает круг от бара.
- `margin-top: -24px` — круг выступает над верхней кромкой бара.
- Подпись «Волли» под кругом, `11px`, активная `--ink`/500, неактивная `--ink-30`.
- Центр-вкладка визуально всегда «акцентная», но **active-состояние** (текущий роут `/volly`)
  читается через подпись (ink/500 vs ink-30), как у прочих вкладок.

### Состояния обычных вкладок (Лента/Каталог/Друзья/Я)

Без изменений из §11: **active** — `--ink` иконка+подпись + accent-gradient пип ~5px над
иконкой; **inactive** — `--ink-30`, пип прозрачный (держит выравнивание).

### Бейдж уведомлений

Друзья и Я могут нести точку-бейдж `7×7` `--accent-magenta` у верх-right иконки
(новые приглашения / заявки). Без числа — только наличие.

---

## 13. Контекстная строка «Спроси Волли»

> Полоса вызова Волли на контент-экранах (Лента, Каталог, Знакомства). Не glass-карточка —
> это inline-control. Волли живёт тремя способами (UX-спек): центр-вкладка, **эта строка**,
> голос в карточках.

```css
display: flex; align-items: center; gap: 8px;
background: var(--glass-bg);            /* #ffffffb0 — ambient, не text-heavy */
border: 1px solid var(--glass-border);
border-radius: var(--r-card);           /* 16px */
padding: 11px 12px;
```

- **Ведущая иконка** (`18px`, `--accent-magenta`):
  - `Sparkles` — когда тап по строке открывает чат Волли (Лента, Знакомства).
  - `Mic` — когда строка сама является голосовым вводом-фильтром на месте (Каталог, §15-фильтр).
- **Текст-подсказка**: `body-sm` (13px) Manrope, `--ink-50`. Контекстный по экрану
  («что сегодня вечером?», «с кем сходить на концерт?», «район, кухня, настроение…»).
- Вся строка тап-таргетируемая (`<button>`), `aria-label` дублирует подсказку.
- На экранах со списками — строка сверху списка, sticky допустим (не обязателен в прототипе).

---

## 14. Голосовые бабблы (Волли-чат)

> Чат Волли: реплики юзера и Волли — голосовые. Бабблы — **chrome чата, не glass (§4)**:
> backdrop-blur НЕ применять (в чате их десятки — бюджет блюра §4). Транскрипт по умолчанию
> СКРЫТ, раскрывается тапом (UX-спек).

### 14.1 Баббл юзера (исходящий)

```css
align-self: flex-end;
max-width: 80%;
background: var(--accent-magenta);      /* сплошная заливка */
color: #ffffff;
padding: 9px 13px;
border-radius: 14px 14px 4px 14px;      /* нижний-правый угол схлопнут — «хвост» */
```

Содержимое строкой: иконка `Mic` (белая, 15px) · **дорожка волны** · длительность
(`11px`, белый `alpha 0.85`, формат `M:SS`).

### 14.2 Баббл Волли (входящий)

- Слева от баббла — аватар-круг `30×30`, `--accent-magenta`, иконка `Sparkles` белая `16px`.
- Сам баббл:

```css
background: var(--surface-volly);       /* #ffffffcc, без blur */
border-radius: 4px 14px 14px 14px;      /* верхний-левый угол схлопнут */
padding: 9px 13px;
```

Содержимое строкой: кнопка-play (круг `22×22`, `--accent-magenta`, иконка `Play` белая 12px)
· **дорожка волны** (цвет волны — `--accent-magenta`) · длительность (`11px`, `--ink-50`).
Текстовая реплика Волли — `body` (13px/1.5), `--ink`, `margin-top: 6px` под волной.

### 14.3 Дорожка волны (waveform)

| Параметр | Значение |
|---|---|
| Бар | ширина `2px`, радиус `1px`, gap `2px` |
| Высоты | варьируются `5–18px` |
| Кол-во | 8–12 баров (фикс на сообщение) |
| Цвет (юзер) | `#ffffff` alpha `0.7` |
| Цвет (Волли) | `--accent-magenta` |

- **Прототип:** высоты — детерминированный псевдослучай по `messageId` (стабильны между ререндерами).
- **Реально (после SpeechKit):** даунсэмпл амплитуды записи в массив высот.

### 14.4 Транскрипт и автоозвучка

- Транскрипт **скрыт**; раскрытие — тап по бабблу. Раскрытый текст — `body` (13px/1.5),
  у юзера белый, у Волли `--ink`.
- Ответ Волли проигрывается **автоматически** (тап «отправить» юзера — свежий user-gesture,
  покрывает autoplay-политику браузера в пределах окна жеста).
- Глобальный тумблер «без звука» — в настройках (`/me` → шестерёнка). При включённом —
  автоозвучка off, play-кнопка остаётся.

### 14.5 Шапка чата Волли

Хедер `/volly`: слева аватар-круг `26×26` (`--accent-magenta` + `Sparkles` белый) + «Волли»
(`display-md`-ish 17px/500); справа `Pencil` (`--ink-50`) — новый чат.

---

## 15. Карточки результатов в чате + каталожная карточка

> Волли отдаёт результаты **карточками прямо в баббл** (UX-спек: не текстом). Тот же
> family-паттерн на двух плотностях: компактная (in-chat) и полная (каталог/лента).

### 15.1 Компактная карточка (внутри баббла Волли)

```css
border: 1px solid var(--glass-border-soft);   /* hairline; см. примечание ниже */
border-radius: var(--r-card);
overflow: hidden;
```

> `--glass-border-soft` = `--ink-30` использовать как hairline-обводку контент-карточек
> (отдельный токен не вводим; в §10 запрет на >1px, 1px `--ink-30` допустим).

- Ряд: превью `48×48` (`--r-input` 12px, фон `--glass-bg`, иконка-плейсхолдер `--ink-30`)
  + заголовок `body`/500 + мета `body-sm`/`--ink-50`.
- **Сплит-футер**: 2 действия, разделены вертикальным hairline `--ink-30`.
  - левое — «Подробнее», `body-sm`, `--ink-50`;
  - правое — основное действие («Забронировать»/«Открыть»), `body-sm`/500, `--accent-magenta`.
- In-chat действие = **текст-акцент**, не сплошная кнопка (сплошной ink-CTA §5 — только
  один на экран, он принадлежит экрану, не баббла).

### 15.2 Полная каталожная карточка (Каталог, Лента, профиль друга)

```css
border: 1px solid var(--ink-30);
border-radius: var(--r-card);
overflow: hidden;
```

- Фото-блок сверху, высота `92px` (каталог-лист) / `132px` (Лента, person-карточка §18).
  Плейсхолдер: иконка категории `--ink-30` на `--glass-bg`.
- Тело `14px 16px` (плотнее для лист-карточки — `10px 12px`): заголовок `body`/500,
  мета `body-sm`/`--ink-50`, опц. тег «по вайбу» (§16.1).
- Карточка целиком тап → детальный экран. Кнопки внутри тела — по экрану.

### 15.3 Иконки-плейсхолдеры категорий (lucide)

`Music` концерт · `UtensilsCrossed` ресторан · `Wine` / `GlassWater` бар ·
`Coffee` кофейня/чайная · `Plane` поездка · `Ticket` событие/билет.

---

## 16. Чипы Волли

Три семантических вида. Все — `r-pill`-семейство, но мельче кнопок §5.

### 16.1 Seed-чип / тег «по вайбу» (подсказки Волли)

Примеры-затравки фильтра («район», «кухня», «сегодня», «удиви меня») и тег-маркер
«по вайбу» на карточках.

```css
background: var(--accent-tint);         /* rgba(212,83,126,0.12) */
color: var(--rose-deep);                /* #6b2e4d */
font: 11px var(--font-body);            /* micro; letter-spacing 0.02em */
padding: 5px 10px;
border-radius: 13px;
border: none;
```

- Seed-чип — **тап-таргет**: тап вкидывает слово в строку Волли / запрос.
- Тег «по вайбу» на карточке — **не интерактивен** (маркер, не кнопка); `aria-hidden` для
  декоративного, либо в `aria-label` карточки текстом.

### 16.2 Категория-чип (переключатель раздела каталога)

«События / Рестораны / Концерты / Поездки» — выбираемые, ровно один активен.

| Состояние | Background | Border | Text |
|---|---|---|---|
| idle | `var(--glass-bg)` | `1px solid var(--ink-30)` | `--ink`, 12px/400 |
| selected | `var(--accent-magenta)` | none | `#fff`, 12px/500 |

Радиус `14px`, padding `6px 11px`. Выбранность — `aria-pressed`.

### 16.3 Трейт-чип (черты на person-карточке)

Нейтральный, **read-only** («спокойный темп», «узкий круг»).

```css
background: var(--glass-bg);
border: 1px solid var(--ink-30);
color: var(--ink-70);
font: 11px var(--font-body);
padding: 4px 9px;
border-radius: 12px;
```

---

## 17. Слайд-ап шиты (бронь, подарок билета)

> Выезжающая снизу панель. Бронь [🎭] и подарок билета [🎭].

### Структура

```css
/* Затемнение */
position: fixed; inset: 0;
background: var(--scrim);               /* rgba(42,24,50,0.5) */

/* Панель */
background: #ffffff;                    /* solid — поверх скрима, не нужен glass */
border-radius: 24px 24px 0 0;           /* r-portrait сверху */
padding: 14px 18px 20px;
```

- **Грабер** сверху по центру: `36×4`, `--ink-30`, `border-radius:2px`, `margin:0 auto 16px`.
- **Шапка шита**: иконка-превью `44×44` (`--r-input`, `--glass-bg`) + заголовок объекта
  (`body`/500) + мета (`body-sm`/`--ink-50`). Снизу — hairline `--ink-30`.
- **Тело**: поля (даты/время чипами, гости-степпер, поле пожелания и т.п.).
- **Строка пред-заполнения Волли**: иконка `Sparkles` (13px, `--accent-magenta`) +
  пояснение `micro`/`--ink-50` («Волли подставил 20:00 — под „вечер“ из запроса»).
- **CTA подтверждения**: primary pill §5 (сплошной `--ink`) — единственная на шите.

### Чипы выбора внутри шита (дата/время)

idle: `--glass-bg` + `1px --ink-30` + `--ink`; selected: `--accent-magenta` + `#fff`/500.
Радиус `--border` среднего масштаба (`8px`), padding `7px 10–12px`. (Это вариант §16.2 в
прямоугольном масштабе — radius меньше, т.к. в сетке, не в строке-скролле.)

### Анимация

- Вход: панель — spring снизу (`--ease-spring`); скрим — fade `--dur-base`.
- Выход: reverse. Тап по скриму / свайп грабера вниз — закрыть.
- Подтверждение: шит закрывается → реплика-подтверждение прилетает в чат Волли +
  запись в `/me` (Мои брони / Мои билеты).

---

## 18. Person-карточки (знакомства, профиль друга)

> Вайб-мэтч людей. **Без мэтч-скора** (UX-спек) — совпадение проговаривается словами.

### Карточка человека (лист «Знакомства»)

Полная каталожная карточка §15.2 с фото-блоком `132px`, тело `12px`:

1. Имя — `display-md`-ish (15px)/500, `--ink`.
2. Архетип + дистанция — `body-sm`/`--ink-50` («„Хранитель тихих вечеров“ · рядом»).
3. **Строка общего вайба** — иконка `Sparkles` (13px `--accent-magenta`) + текст `body-sm`
   `--ink` («Вы оба „тихие вечера“»).
4. Ряд трейт-чипов §16.3 (общие черты).
5. **CTA действия** — accent-outlined (см. ниже).

### Accent-outlined action (соц-действие)

CTA соц-контекста («Познакомиться», «Подарить», «Пригласить» в карточках):

```css
background: transparent;
border: 1px solid var(--accent-magenta);
color: var(--accent-magenta);
font: 13px/1 var(--font-body); font-weight: 500;
padding: 8px 14px;
border-radius: var(--r-input);          /* 12px */
```

- Это санкционированный вариант: 1px-обводка (§10 запрещает >1px — здесь 1px, ок),
  не gradient. Сплошной §5-primary в person-карточке **не** применять — он принадлежит
  экрану-странице, не карточке в списке.
- Hover/active — как §5 (scale 1.02 / 0.98).

### Профиль друга (детальный экран)

Фото сверху · вайб-идентичность в формате `/me` · блок «ваш общий вайб» (§20,
accent-обводка) · «общие друзья» · «был здесь» (история мест — горизонтальный скролл
карточек §15.2) · «скоро идёт» · 3 действия в ряд: Написать (ghost §5) / Пригласить
(accent-outlined) / Подарить (accent-outlined).

---

## 19. Сегмент-переключатели

> Бинарный/тернарный таб внутри экрана: «Мои друзья ↔ Знакомства», «Входящие ↔ Исходящие»,
> и т.п. Дифференциация активного — **поверхностью, не цветом** (бюджет accent + §10).

```css
/* Трек */
display: flex;
background: var(--glass-bg);
border-radius: var(--r-input);          /* 12px */
padding: 3px;

/* Сегмент — общий */
flex: 1; text-align: center;
font: 13px var(--font-body);
padding: 7px;
```

| Состояние | Background | Text |
|---|---|---|
| inactive | `transparent` | `--ink-50`, 400 |
| active | `#ffffff` (solid) | `--ink`, 500 |

- Активный сегмент: сплошная белая «таблетка» внутри трека, `border-radius` на 3px меньше
  трека (`9px`), без тени (§10).
- Переход — `--dur-fast` ease-out на смену фона/текста. Опц. в прототипе: framer-motion
  `layoutId` для скольжения белой таблетки (не обязателен).
- Сегментов 2–3. Семантика: `role="tablist"` / `aria-selected`.

---

## 20. Блок «По вайбу» (объяснение мэтча)

> Сквозной паттерн: «почему по вайбу» на карточке места, «ваш общий вайб» в профиле друга,
> «почему рекомендовано» в Ленте. Несёт голос Волли (§9). Это **единственное** место, где
> санкционирована 1px-обводка цветом `--accent-magenta` (как focus-state в §5/§10).

```css
border: 1px solid var(--accent-magenta);
border-radius: var(--r-card);
padding: 12px 14px;
background: var(--accent-tint);         /* лёгкая розовая подложка — опц., усиливает блок */
```

Содержимое:
- Иконка `Sparkles` (14px, `--accent-magenta`) + микро-заголовок «Почему по вайбу» /
  «Ваш общий вайб» — `body-sm`/500, `--ink`.
- Тело — реплика в тоне Волли (§9: italic-friendly, genderless, first-person),
  `body` (13px/1.5), `--ink-70`. Допустим один `AccentWord` (§7) — это и есть «один
  gradient на экран», если экран его больше нигде не тратит.

> Блок «по вайбу» — родственник «Volly speaks» (§9), но отдельный: §9-блок комментирует
> карту/контент, §20-блок объясняет *мэтч/рекомендацию*. Не сливать; общий — только тон.

---

## Реестр компонентов v0.2 (для извлечения в код)

CC по ходу сборки извлекает переиспользуемые компоненты (порог — 2–3 использования, §-конвенция):

| Компонент | Вводится на экране | Переиспользуется |
|---|---|---|
| `<BottomNav>` | nav-shell | весь `(app)` |
| `<VollyAskBar>` | Каталог | Лента, Знакомства |
| `<VoiceBubble variant="user\|volly">` | Волли-чат | — |
| `<ResultCard density="compact\|full">` | Волли-чат | Каталог, Лента, профиль друга |
| `<VollyChip kind="seed\|category\|trait">` | Каталог | шиты, person-карточки |
| `<SlideUpSheet>` | Шит брони | Подарок билета |
| `<PersonCard>` | Знакомства | Друзья |
| `<SegmentToggle>` | Знакомства | Приглашения |
| `<VibeReasonBlock>` | Карточка места | профиль друга, Лента |
