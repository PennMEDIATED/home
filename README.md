# Penn MEDIATED — Home

The homepage for the [Center on Media, Technology and Democracy](https://infodem.upenn.edu). Static HTML/CSS, no build step — same conventions as the [`about`](https://github.com/PennMEDIATED/about) repo (shared spacing tokens, brand colors, and fonts).

- `index.html` — page markup
- `styles.css` — all styling (design tokens live at the top in `:root`)
- `assets/` — images, GIFs, and `broadcast-tower.html` (the interactive hero graphic, embedded via iframe)

## Updating content

The **What's New** grid is meant to stay current. It's fixed-size — when you add something new, the card in the bottom-right position comes out so the count stays at 7 cards (a full two rows of 4). The newest card automatically spans two columns as one wide card, always appearing largest in the top-left position; its image and text both use the card's full width. The remaining cards use one column each and automatically flow into the next available grid position. You don't need to touch any CSS to do this; just describe the update and hand it to Claude Code (or edit `index.html` directly following the same pattern).

### Updating "What's New"

First, upload the image directly to `assets/whats-new/` in this repository:

1. Open the `assets/whats-new/` folder on GitHub.
2. Select **Add file**, then **Upload files**.
3. Choose the image and commit it to the repository.
4. Copy its filename for the prompt below.

Use a short, descriptive filename with lowercase letters and hyphens, such as
`podcast-series-launch.jpg`. The image must be stored in the repository before the
update is requested; do not submit an external image link.

Once the image is in `assets/whats-new/`, give Claude Code this prompt:

> Add a new What's New item: "**[Title]**" — [one or two sentence description]. Link it to [destination URL]. Use the image I uploaded at `assets/whats-new/[image-filename]`. Use this image alt text: "[brief description of the image]". Remove the item in the bottom-right position to make room for it.

Example, filled in (this is the current front card, for reference):

> Add a new What's New item: "**New Report on Monitoring LLMs**" — In a new Carnegie Endowment paper, Alex Engler and Danaé Metaxa argue for longitudinal monitoring to understand how LLMs impact politics. Link it to https://carnegieendowment.org/research/2026/08/llms-artificial-intelligence-longitudinal-monitoring-norms-politics-research. Use the image I uploaded at `assets/whats-new/llm-monitoring-report.png`. Use this image alt text: "Carnegie Endowment report on monitoring large language models". Remove the item in the bottom-right position to make room for it.

What Claude Code will do:
1. Confirm that the named image already exists in `assets/whats-new/`.
2. Add a new card at the **front** of `.whats-new__grid` in `index.html` (newest items lead). It automatically becomes the largest card, spanning two columns in the top-left position.
3. Use the uploaded image and supplied alt text in the new card. Because the featured layout is applied with `.news-card:first-child`, placing the card first automatically makes it span two columns and shifts every existing card to the next grid position; do not add a special featured class or manually position the other cards.
4. Remove the card in the **bottom-right** position (currently the last card in the grid, since 7 cards exactly fill two full rows) to keep the total at 7.

The newest card spans two columns on desktop and tablet. Its image uses a wide `2 / 1` ratio and its text sits below it across the full card width. At the phone breakpoint (480px), it returns to the same square-image, single-column stacked layout as every other card. Titles clamp to 2 lines and descriptions to 2 lines, so keep both short; anything longer gets truncated rather than overflowing the card.

### General tips

- Upload the image before sending the prompt. The prompt should point to its exact path inside `assets/whats-new/`; external image URLs are not part of this workflow.
- Include useful alt text that describes the image for someone who cannot see it.
- If you don't have an image yet, wait to add the update rather than using a fabricated stock image.
- If you want more than one new item added, or a different number of oldest items removed, just say so explicitly (the default is "one in, one out").
- After any content update, open `index.html` in a browser to confirm the new card looks right before considering it done.

### Image sizes

| Image | How it displays | Recommended file |
|---|---|---|
| **What's New** — featured card (newest item, spans 2 columns) | Cropped to a 2:1 wide rectangle with `object-fit: cover` | 1200×600px or larger, roughly 2:1 |
| **What's New** — regular card | Cropped to a 1:1 square with `object-fit: cover` | 800×800px or larger, square |
| **What's New** — logo/lockup card (use the `news-card__image--contain` class, e.g. partner logos) | Not cropped — letterboxed inside the square tile with `object-fit: contain` | Any size; a transparent-background PNG looks cleanest |
| Research CTA / Faculty CTA screenshots | Not cropped — displays at its own aspect ratio, up to ~523px wide on desktop | Export already cropped to the shape you want, at least 1050px wide for a sharp retina image |

The two "cropped" rows above will center-crop whatever you upload, so keep the subject centered in the frame. Everything else displays uncropped at its native aspect ratio, so crop the image yourself before uploading rather than relying on the page to do it.

## Typography

Sitewide convention. The `--fs-*`/`--lh-*` block at the top of `styles.css` is canonical and identical in every page repo.

**Two families, no third.** `--f-serif` (EB Garamond) for page and section titles and pull-quote copy; `--f-sans` (DM Sans) for everything else. There is no monospace face — uppercase micro-labels are DM Sans, not Courier.

**Sizes come from tokens, never raw px.**

| Token | Mobile (=<480px) | Desktop (>=1440px) | Used for |
| --- | --- | --- | --- |
| `--fs-display` | 36px | 76px | the hero title |
| `--fs-h1` | 36px | 56px | page title (`.about-center__title` here) |
| `--fs-h2` | 26px | 40px | section titles, the CTA leads |
| `--fs-h3` | 20px | 24px | card and third-level titles |
| `--fs-lede` | 18px | 20px | intro paragraphs |
| `--fs-body` | 16px | 16px | body copy |
| `--fs-small` | 14px | 14px | captions, meta, footer copy |
| `--fs-small-serif` | 15px | 15px | EB Garamond at small sizes |
| `--fs-micro` | 12px | 12px | uppercase labels, tags, dates |

`.hero__title` and `.about-center__title` used to carry their own bespoke clamps (`40→76` and `38→56`); those are now `--fs-display` and `--fs-h1`, whose ceilings match exactly.

The top five are `clamp()` values that interpolate across the viewport, so tablet widths need no separate `@media` override. Only add a breakpoint font-size when a specific layout actually demands it.

**12px is the floor** for page copy. Nothing on the page ships smaller.

**Line heights are tokens too** — `--lh-display` 1.05, `--lh-heading` 1.15, `--lh-lede` 1.26, `--lh-title` 1.3, `--lh-body` 1.55. Never set a line-height in px; it breaks the fluid sizes.

**No kicker labels.** No small uppercase label above a heading anywhere on the page — the sitewide convention already documented in `about`, `team-leadership`, `data` and `grants`. The hero's `.hero__eyebrow-brand` ("Penn MEDIATED") is not one of these: it is white serif italic brand-name text, not a kicker, and it stays.

**The one exception is the `.nav`/`.brand` component.** Its sizes (9.5px eyebrow, 15/18px wordmark, 16px links, 11px subscribe) come straight from the Figma nav frame and are deliberately left as raw px — see "Site nav" above for why those rules are kept at all. Its font families were moved off `--f-mono` with everything else, so the reference stays accurate for the header build; only the sizes are frozen.

## Site nav

`styles.css` carries a full `.nav` component — sticky bar, brand lockup, links, subscribe button, sized by `--nav-h` and `--c-nav-bg`. There is deliberately no matching markup in `index.html`: WordPress renders the live nav, wired to its native menu system so submenu items can be added in wp-admin without a code deploy.

Keep these rules. They are the only implementation of the nav design outside Figma, and they are the reference the WordPress header build works from. They are not dead code to prune.

`--nav-h` belongs here, with the component that defines it. Page repos never hardcode a nav height — if one needs the value (for `scroll-margin-top` on an anchor target under the sticky nav, say), the header build sets `--nav-h` and the page reads `var(--nav-h, 0px)`, so the page still lays out correctly standalone where there is no nav.

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

**Brand gradient** — used on every purple-to-red surface (the about page's orbital section and newsletter/supporters block, the home hero): `linear-gradient(150deg, #5533ee 0%, #df3611 81%)` via `--c-gradient`. Never write this gradient out by hand or approximate it with different stops — reference the variable so a future palette tweak only has to happen in one place per repo. (`home` no longer has a newsletter/supporters section — see below.)

**Type:**
- `--f-serif`: `'EB Garamond', Georgia, 'Times New Roman', serif` — headlines, quotes, the "MEDIATED" wordmark
- `--f-sans`: `'DM Sans', system-ui, -apple-system, sans-serif` — everything else
- `--f-mono`: `'Courier New', Courier, monospace` — small meta labels only

**Layout:** `--max-w: 1440px` page cap, `--pad-x: var(--space-1000)` (80px) side padding on the shared `*__inner` containers. In `home`, `--pad-x` scales down responsively (32px under 900px, 20px under 480px) — `about`'s simpler page hasn't needed this yet, but if you add anything to `about` wider than a headline/paragraph, backport the same responsive `--pad-x` media queries rather than letting content overflow on mobile.

### Layout conventions

- Every section's content wrapper is named `.<section>__inner` and shares one rule (`width:100%; max-width:var(--max-w); margin-inline:auto; padding-inline:var(--pad-x);`). Add new sections to that shared selector list instead of writing a one-off inner container.
- Section-to-section vertical rhythm uses `--space-1000` (80px) for generous breaks (e.g. before a new heading like "What's New") and `--space-600` (48px) between a heading row and the content below it.
- BEM-ish naming: `.block__element`, modifiers as `.block--variant` or `.block__element--variant` (e.g. `.news-card--dark`, `.news-card__image--contain`).

### Shared components

- **Section header pattern** (`What's New` / etc.): a heading (24px, weight 600, `--c-dark`) and a "view all" link (14px, weight 500) in a `flex` row with `align-items:baseline` and a bottom border. Keep any new listing section (a future "Publications" grid, say) on this exact pattern rather than inventing a new header style.
- **Cards** (`news-card`): the first card automatically spans two columns as one wide card, with a `2 / 1` image above a full-width text body. All other cards place a square image (`aspect-ratio: 1`, `object-fit:cover`) above a plain-rectangle text body. Title and description each clamp to 2 lines (`-webkit-line-clamp`) so copy length stays controlled. Brand-lockup logos that lose their wordmark under a center-crop use `.news-card__image--contain` to letterbox instead of cropping.
- **Responsive grids**: never let a multi-column grid just shrink its columns as the viewport narrows — text becomes unreadably vertical. Reflow to fewer columns at defined breakpoints instead (see `home`'s `.whats-new__grid` media queries).

`home` does not have a newsletter or "Supported by" section — those were removed. The `about` repo still has both (`.newsletter`, `.supporters`, the shared `.cta-block` gradient wrapper); if you're porting a component between the two repos, don't reintroduce them here without being asked.

### Hyperlinks in body copy

This page has no inline links inside flowing prose today — every `<a>` here is a whole-card/tile link (`news-card`, `research-cta__link`, etc.) or a nav/footer link, not a link embedded mid-sentence in a paragraph. If body copy with an inline link is ever added, use the sitewide treatment: `color: var(--c-red)`, `font-weight: 500`, no underline, `opacity: 0.7` on hover, no color change — see `.event-card__caption a` (`events`), `.post-excerpt a` (`blog`), `.intro__body a` (`data`/`grants`), and the bio/card-desc rules in `our-team-faculty`.

### Keeping the two repos in sync

`about` and `home` are separate repos with duplicated CSS, not a shared stylesheet — so consistency is a discipline, not something enforced automatically. When you change a shared token or component in one repo, check whether the same change belongs in the other before considering the task done.
