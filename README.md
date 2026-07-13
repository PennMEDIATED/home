# Penn MEDIATED — Home

The homepage for the [Center on Media, Technology and Democracy](https://infodem.upenn.edu). Static HTML/CSS, no build step — same conventions as the [`about`](https://github.com/PennMEDIATED/about) repo (shared spacing tokens, brand colors, fonts, and the "Subscribe Here" newsletter treatment).

- `index.html` — page markup
- `styles.css` — all styling (design tokens live at the top in `:root`)
- `assets/` — images, GIFs, and `broadcast-tower.html` (the interactive hero graphic, embedded via iframe)

## Updating content

The **What's New** grid and **Recent Events** section are meant to stay current. Both are fixed-size — when you add something new, the oldest entry comes out so the count stays the same (7 cards for What's New, 2 for Events). You don't need to touch any CSS to do this; just describe the update and hand it to Claude Code (or edit `index.html` directly following the same pattern).

### Updating "What's New"

Sample prompt:

> Add a new What's New item: "**[Title]**" — [one or two sentence description]. Link it to [URL]. Use this image: [path to image, or a URL to pull from]. Remove the oldest item to make room for it.

Example, filled in:

> Add a new What's New item: "**Center Launches Podcast Series**" — Our new podcast brings together researchers and journalists to unpack the week's biggest stories in media and democracy. Link it to https://infodem.upenn.edu/podcast/. Use this image: https://infodem.upenn.edu/wp-content/uploads/2026/06/podcast-launch.png. Remove the oldest item to make room for it.

What Claude Code will do:
1. Download the image into `assets/whats-new/`.
2. Add a new card at the **front** of `.whats-new__grid` in `index.html` (newest items lead).
3. Remove the **last** card in the grid to keep the total at 7.
4. Rebalance the `news-card--s1/s2/s3` span classes so the 6-column grid math still adds up (each row of cards must sum to 6 — e.g. 3+2+1 or 2+2+1+1). Point this out explicitly if you have a preference for how prominent the new card should be (span 3 = biggest, span 1 = smallest).

### Updating "Recent Events"

Sample prompt:

> Add a new event to Recent Events: "**[Event Name]**", [date, e.g. "Wed, Sep 3, 2026"] — [one sentence description]. Link it to [URL]. Use this image: [path or URL]. Remove the oldest event.

Example, filled in:

> Add a new event to Recent Events: "**Spring 2026 Research Symposium**", Thu, Apr 9, 2026 — A day of talks from Penn MEDIATED-affiliated faculty on the latest in information ecosystem research. Link it to https://infodem.upenn.edu/events/. Use this image: assets/events/symposium.jpg (already downloaded). Remove the oldest event.

What Claude Code will do:
1. Download the image into `assets/events/`.
2. Add a new `.event-card` at the front of `.events__grid` in `index.html`.
3. Remove the oldest (currently second) card to keep the total at 2.
4. Match the existing card structure exactly — date, title, one-line description, image — since `.event-card__title` and `.event-card__desc` use a fixed 2-line height (`height: 2.3em` / `3.4em` with `-webkit-line-clamp: 2`) specifically so both cards' images always line up. Keep descriptions roughly one sentence so they don't get visibly truncated.

### General tips

- If you have a real image, just say where it is (a local path or a URL) — Claude Code will pull it in rather than inventing a placeholder.
- If you don't have an image yet, say so — better to leave a card without one than fabricate a stock photo.
- If you want more than one new item added, or a different number of oldest items removed, just say so explicitly (the default is "one in, one out").
- After any content update, open `index.html` in a browser to confirm the new card looks right before considering it done.

## Style guide (shared across `about` and `home`)

Both repos are static HTML/CSS built off the same design system. If you're adding or editing anything, pull values from here rather than guessing new ones — that's what keeps the two sites looking like one brand instead of drifting apart.

### Design tokens (`:root` in `styles.css`)

**Spacing** — Atlassian's 8px scale. Always use the variable, never a raw pixel value:

```
--space-025: 2px   --space-100: 8px   --space-300: 24px  --space-600: 48px
--space-050: 4px   --space-150: 12px  --space-400: 32px  --space-800: 64px
--space-075: 6px   --space-200: 16px  --space-500: 40px  --space-1000: 80px
--space-250: 20px
```

**Color:**

| Token | Hex | Use |
|---|---|---|
| `--c-dark` | `#0d0d0c` | Primary text, dark backgrounds |
| `--c-accent` | `#5533ee` | Brand purple |
| `--c-red` | `#f03d1f` | Brand red/orange, links, tags |
| `--c-gray` | `#888680` | Secondary/muted text |
| `--c-gray-dark` | `#54534f` | Body copy needing real contrast (~8:1 on white) — `home` only so far; prefer this over `--c-gray` for paragraph text, backport to `about` if you add long-form copy there |
| `--c-light-bg` | `#f8f7f4` | Placeholder/image background |
| `--c-white` | `#ffffff` | — |

**Brand gradient** — used on every purple-to-red surface (the about page's orbital section, both repos' newsletter/supporters block, the home hero): `linear-gradient(150deg, #5533ee 0%, #df3611 81%)` via `--c-gradient`. Never write this gradient out by hand or approximate it with different stops — reference the variable so a future palette tweak only has to happen in one place per repo.

**Type:**
- `--f-serif`: `'EB Garamond', Georgia, 'Times New Roman', serif` — headlines, quotes, the "MEDIATED" wordmark
- `--f-sans`: `'DM Sans', system-ui, -apple-system, sans-serif` — everything else
- `--f-mono`: `'Courier New', Courier, monospace` — small meta labels only (e.g. event "Recording available" tags)

**Layout:** `--max-w: 1440px` page cap, `--pad-x: var(--space-1000)` (80px) side padding on the shared `*__inner` containers. In `home`, `--pad-x` scales down responsively (32px under 900px, 20px under 480px) — `about`'s simpler page hasn't needed this yet, but if you add anything to `about` wider than a headline/paragraph, backport the same responsive `--pad-x` media queries rather than letting content overflow on mobile.

### Layout conventions

- Every section's content wrapper is named `.<section>__inner` and shares one rule (`width:100%; max-width:var(--max-w); margin-inline:auto; padding-inline:var(--pad-x);`). Add new sections to that shared selector list instead of writing a one-off inner container.
- Section-to-section vertical rhythm uses `--space-1000` (80px) for generous breaks (e.g. before a new heading like "What's New") and `--space-600` (48px) between a heading row and the content below it.
- BEM-ish naming: `.block__element`, modifiers as `.block--variant` or `.block__element--variant` (e.g. `.news-card--dark`, `.event-card__status--upcoming`).

### Shared components

- **Section header pattern** (`What's New` / `Recent Events` / etc.): a heading (24px, weight 600, `--c-dark`) and a "view all" link (14px, weight 500) in a `flex` row with `align-items:baseline` and a bottom border. Keep any new listing section (a future "Publications" grid, say) on this exact pattern rather than inventing a new header style.
- **Newsletter CTA ("Subscribe Here")**: a white rectangle button. On hover, the label is knocked out via `background-clip:text` filled with `--c-gradient`, so the brand gradient appears to show through the letterforms — background stays solid white, only the text goes transparent. This exact effect lives in both repos' `.newsletter__cta:hover .newsletter__cta-label` — if you touch one, touch the other.
- **Supporters row**: `.supporters__label` 24px/weight 700/uppercase, Knight Foundation logo at `height:65px`, Penn logo at `height:120px`, both `width:auto`. Logos use `assets/knight-foundation-logo.png` and `assets/upenn-logo-full.png` — same files, copied between repos; don't re-crop or re-export one without the other.
- **Cards** (`news-card`, `event-card`): image on top (fixed `aspect-ratio`, `object-fit:cover`), then a text body. When a card grid holds more than one item side by side, lock the title/description to a fixed height (`height` + `-webkit-line-clamp`, not just `min-height`) so images stay aligned regardless of copy length — see `home`'s `.event-card__title`/`.event-card__desc` for the pattern; a `min-height` alone isn't sufficient because it only sets a floor, not a ceiling.
- **Responsive grids**: never let a multi-column grid just shrink its columns as the viewport narrows — text becomes unreadably vertical. Reflow to fewer columns at defined breakpoints instead (see `home`'s `.whats-new__grid` and `.events__grid` media queries).

### Keeping the two repos in sync

`about` and `home` are separate repos with duplicated CSS, not a shared stylesheet — so consistency is a discipline, not something enforced automatically. When you change a shared token or component in one repo, check whether the same change belongs in the other before considering the task done.

