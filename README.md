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

> Add a new What's New item: "**New Report on Monitoring LLMs**" — In a new Carnegie Endowment paper, Alex Engler and Danaé Metaxa argue for longitudinal monitoring to understand how LLMs impact politics. Link it to https://carnegieendowment.org/research/2026/08/llms-artificial-intelligence-longitudinal-monitoring-norms-politics-research. Use the image I uploaded at `assets/whats-new/llm-monitoring-report.webp`. Use this image alt text: "Carnegie Endowment report on monitoring large language models". Remove the item in the bottom-right position to make room for it.

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

| Image | How it displays | Give it |
|---|---|---|
| **What's New** — featured card (newest item, spans 2 columns) | Cropped to a 2:1 wide rectangle with `object-fit: cover` | ~1280×640 |
| **What's New** — regular card | Cropped to a 1:1 square with `object-fit: cover` | ~640×640 |
| **What's New** — logo/lockup card (use the `news-card__image--contain` class, e.g. partner logos) | Not cropped — letterboxed inside the square tile with `object-fit: contain` | ~640px wide, transparent background |
| Research CTA / Faculty CTA screenshots | Not cropped — displays at its own aspect ratio, up to ~523px wide on desktop | ~1046px wide, already cropped to the shape you want |

Those figures are 2× the CSS box, which is what a retina screen needs; going bigger just makes the visitor download pixels the browser throws away. The two "cropped" rows center-crop whatever you upload, so keep the subject centred. Everything else displays at its native aspect ratio, so crop it yourself rather than relying on the page to do it.

**See "Images and video" below before adding anything** — it covers the required `width`/`height` attributes, WebP and MP4 conversion, and the commands to do it.

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

## Embedding this page

WordPress renders the real site; this repo is the source. The launch plan is direct-to-disk deployment, which needs no iframe — but iframe embedding still works and is the documented fallback, so keep this snippet accurate if you rename the repo or change its Pages URL.

Paste into a **Custom HTML block** as one line. The site runs **Twenty Twenty-Five**, a block theme, and a Custom HTML block has no width control of its own — so wrap it in a **Group block set to Full width**. This is not optional for these pages: Twenty Twenty-Five's `theme.json` sets `contentSize: 645px` (`wideSize: 1340px`), so an unwrapped embed renders in a 645px column, and every full-bleed colour band in the design collapses with it:

```html
<iframe id="pm-home" src="https://pennmediated.github.io/home/" title="Home — Penn MEDIATED" loading="lazy" style="width:100%;height:4300px;border:0;display:block"></iframe><script>(function(){var f=document.getElementById('pm-home');window.addEventListener('message',function(e){if(e.source!==f.contentWindow)return;var d=e.data||{},h=d.frameHeight||(d.type==='partners-page-resize'?d.height:0);if(h)f.style.height=h+'px';});})();</script>
```

The `height` in the snippet is only the starting value. Every Penn MEDIATED page posts its real height to the parent as `{ frameHeight: <int> }` — on load, on resize, once webfonts settle, and on any `ResizeObserver` change, so reveal animations, expanding cards and `<details>` toggles all resize the frame. The listener in the snippet applies it. `grants-rfp` also emits an older `{ type: 'partners-page-resize', height }` message; the snippet accepts both.

The page checks `window.self === window.top` before posting, so opening it directly does nothing. If you add a new page repo, copy the script from the bottom of this `index.html` so it behaves the same way.


## Images and video

This applies to every image, GIF and video added to any Penn MEDIATED repo. It is written to be followed directly — by a person or by a Claude session — without further instruction.

### The one rule that is never optional

**Every `<img>` and `<video>` carries explicit `width` and `height` attributes, holding the file's real intrinsic pixel dimensions.**

```html
<img src="assets/example.webp" width="640" height="334" alt="…">
```

They do not set the display size — CSS does. They give the browser the aspect ratio *before* the file downloads, so it reserves a correctly shaped box instead of collapsing to nothing and shoving everything below it down the page as each file lands. That shift is measured by search engines (Cumulative Layout Shift) and is worse for a reader, who loses their place or clicks a link that just moved.

Every repo has a global `img, video { max-width: 100%; height: auto; display: block; }` reset, so the CSS keeps winning and the attributes only ever contribute the ratio. **Never guess the numbers** — read them off the file.

### Pick the format by what the file is

| Content | Format | Never use |
| --- | --- | --- |
| Photo, screenshot, artwork | **WebP**, quality 88 | PNG or JPEG at full camera resolution |
| Logo, wordmark, icon | **SVG** if you have it, else WebP | — |
| Anything that moves | **MP4** (H.264) + a WebP poster | **GIF, ever** |

GIF is the big one. It has no interframe compression, so a screen recording is roughly ten times the size it needs to be: `research-compendium.gif` was 11.3MB for 290 frames; the identical recording as H.264 is 1.2MB.

### Size it to the box it displays in, not to what you were sent

Find the CSS box the image renders into, then export at **2×** that width for retina. Anything beyond that is bytes the browser downloads and immediately throws away. (`gni-membership.png` was 7992px wide, rendering into a 319px box — a 470KB file doing a 33KB job.)

In this repo:

| Where | CSS box at 1440px | Export at |
| --- | --- | --- |
| What's New — featured card (first child, spans 2 columns) | 640×320, cropped 2:1 | ~1280px wide |
| What's New — regular card | 319×319, cropped square | ~640px square |
| What's New — logo card (`.news-card__image--contain`) | 319px square, letterboxed | ~640px, transparent background |
| Research / Faculty CTA (`.faculty-cta__image`) | up to 523px wide | ~1046px |

Keep the subject centred in cropped slots — the card center-crops whatever you give it.

If you are adding an image somewhere not listed, measure the box first (`getBoundingClientRect().width` in the browser, at a 1440px viewport) and double it.

### Commands

Stills — resize and convert in one pass:

```python
from PIL import Image
TARGET = 640                      # 2x the CSS box
im = Image.open('source.png')
w, h = im.size
if w > TARGET:
    im = im.resize((TARGET, round(h * TARGET / w)), Image.LANCZOS)
im.save('out.webp', quality=88, method=6)
print(im.size)                    # <- these are the width/height attributes
```

Animation — MP4 plus a poster frame:

```bash
ffmpeg -i source.gif -movflags +faststart -pix_fmt yuv420p \
       -vf "scale=1280:-2:flags=lanczos" -crf 24 out.mp4
ffmpeg -i source.gif -frames:v 1 -vf "scale=1280:-2:flags=lanczos" poster.png
python3 -c "from PIL import Image; Image.open('poster.png').convert('RGB').save('out-poster.webp', quality=80, method=6)"
ffprobe -v error -show_entries stream=width,height -of default=nw=1 out.mp4
```

`-crf 24` is a good default; raise it toward 30 for a smaller file, lower it toward 20 for a sharper one. `-pix_fmt yuv420p` is required for Safari and iOS.

### Markup for video

```html
<video src="assets/name.mp4" poster="assets/name-poster.webp" width="1280" height="622"
       autoplay muted loop playsinline preload="metadata" aria-label="…"></video>
```

Each attribute earns its place: `muted` is what permits autoplay at all, `playsinline` stops iOS opening it fullscreen, `poster` means the slot is never empty while the video loads, and `aria-label` replaces `alt` (a `<video>` has no `alt`).

CSS cannot stop autoplay, so **a page with video needs the reduced-motion script** at the end of `<body>`. If the page already has one, leave it alone; if you are adding the first video to a page, add it:

```html
<script>
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.autoplay = false; v.pause(); v.currentTime = 0; v.removeAttribute('loop');
    });
  }
</script>
```

Also check the CSS: any rule that sizes or crops an image needs to name `video` too, or the video slot will not match the image slot it replaced (`.card__image img` becomes `.card__image img, .card__image video`).

### Before you call it done

- [ ] File is WebP, SVG or MP4 — no GIF, no full-resolution PNG or JPEG
- [ ] Its width is about 2× the CSS box it renders into
- [ ] `width`/`height` attributes match the file's real dimensions
- [ ] Real `alt` text (or `aria-label` on a video) that describes the image; empty `alt=""` only if it is purely decorative
- [ ] Lives in this repo's `assets/`, not hotlinked from another site
- [ ] Page opened in a browser at 1440px and ~400px — nothing overflows, nothing jumps on load
- [ ] Originals are not committed alongside the optimised file; git history is the backup

Do not commit an unoptimised original "just in case" — the previous commit already holds it, and a duplicate in the working tree also ships to the server.

## Hyperlinks

One taxonomy, five categories, shared by every page repo. Pick the category by what the link *is*, not by which repo you happen to be editing.

**1. In-text links** — embedded mid-sentence in flowing prose.

| ground | text | underline | hover |
| --- | --- | --- | --- |
| white / light | `--c-red-dark` | none | fade to `opacity: 0.7` |
| colour / gradient | `--c-white` | `border-bottom: 1px solid rgba(255, 255, 255, 0.5)` | fade to `opacity: 0.7` |

Both grounds use `font-weight: 500` and `transition: opacity 0.15s`, and both fade rather than change hue. On a white ground **colour is the affordance** — no underline; the underline is category 2's job. On a coloured ground the red is invisible, so the link goes white and takes the hairline rule instead. Where an underline is used it is a `border-bottom`, never `text-decoration`.

#### Why interactive red is `--c-red-dark`, not `--c-red`

`--c-red-dark` (`#df3611`) is the closing stop of `--c-gradient`, promoted to a token of its own and declared in all twelve repos.

`--c-red` (`#f03d1f`) measures roughly **3.9:1** against white — under the 4.5:1 WCAG AA threshold for body text, and the same 3.9:1 applies to white text sitting on a `--c-red` fill. `--c-red-dark` measures about **4.5:1** either way and clears it. The two are near-indistinguishable at text sizes, so this is a contrast fix, not a visual change.

**The rule: anything you click is `--c-red-dark`.** Links and buttons take it wherever they would otherwise be red-orange — as text colour, as a box fill, as a hover or active state, and on the markers inside them (disclosure chevrons and their labels). It applies in every category and every state.

**`--c-red` stays the brand accent for everything you don't click**: section headings, eyebrow and metadata labels, tag and pill backgrounds, accent bars and card borders, full-width colour bands, the `.card-arrow` hover gradient, and focus rings. These are either large text, non-text UI at the 3:1 threshold, or sit on a tinted rather than white ground.

The one deliberate hold-out is red link text on a **dark** ground (`home`'s `.footer__email`), where the darker red would *reduce* contrast rather than improve it. That link has a separate outstanding issue — on a dark ground the standard is white text with an opacity fade, not red at all.

**2. Independent links** — a standalone text link that isn't inside a sentence ("Learn More About the Center", "Download the Full Schedule"). Unlike category 1 these carry the underline and are set in the body colour, so they read as a control rather than as emphasis inside a sentence:

| ground | text | underline | hover |
| --- | --- | --- | --- |
| white / light | `--c-dark`, `font-weight: 600` | `border-bottom: 1px solid rgba(13, 13, 12, 0.35)` | text and underline both turn `--c-red-dark` (`transition: color 0.15s, border-color 0.15s`) |
| colour / gradient | `--c-white`, `font-weight: 600` | `border-bottom: 1px solid rgba(255, 255, 255, 0.5)` | fade to `opacity: 0.7` |

Plus a **thin arrow** `⟶` after the text. Use `⟶` (`&#10230;`), not the `↗` badge from category 4.

**3. Document buttons** — an independent link that opens a document (a PDF, a report). A filled button box, not text:

| ground | box | text |
| --- | --- | --- |
| white / light | `--c-red-dark` | `--c-white` |
| colour / gradient | `--c-white` | `--c-dark` |

Hover is **movement, not colour** — a lift or nudge. Do not darken or recolour the box.

**4. Links to another web page** — this site or an external one. The containing box carries the shared `.card-arrow`: a 26px dark circle with a white `↗`, in the box's top corner. On hover the arrow scales slightly and its background becomes a sliding purple-to-orange gradient (`@keyframes card-arrow-slide`), and the box itself animates. No separate text button — the whole box is the link.

**Exception:** a link to a research paper is category 2, not this — thin arrow, no badge.

**5. Hyperlinked headings** — a heading that is itself a link (a post title, a card title). Sits in the body colour and shifts to `--c-red-dark` on hover (or fades, on a coloured ground), with **no arrow and no underline**.

### Dropdowns and disclosures

A dropdown, `<details>` block or expand/collapse control uses one affordance sitewide: a **chevron SVG** (`M2 5l5 5 5-5`, 13×13, `--c-red-dark` stroke, `stroke-width: 1.8`) beside a `--c-red-dark` label at `--fs-small`, rotating `180deg` on open with `transition: transform 0.25s`. See `llm-civic-discourse`'s "Full summary & details" toggle for the reference implementation.

Never leave the marker to the browser — style `<select>` with `appearance: none` and supply the chevron, and hide the native `<summary>` marker. The `↗` circle badge is category 4's language and does not belong on a disclosure control.
