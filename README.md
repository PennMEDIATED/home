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
