/**
 * MEDIATED conversation icon — scroll-driven version (one message at a time)
 * --------------------------------------------------
 * Geometry is taken 1:1 from Figma node 533:218 ("conversation icon").
 * Two messages sit on screen. Each scroll step the older one lifts away and fades,
 * the newer one moves up into its place, and a new message pops in below it.
 *
 * Usage:
 *   load this file as a module:  script type="module" src="conversation-scroll.js"
 *   <mediated-conversation></mediated-conversation>
 *
 * Attributes (all optional):
 *   themes       comma-separated theme ids, in order (default: all THEMES)
 *   step-height  scroll distance per new message, any CSS length (default: 40vh)
 *   size         rendered width of the icon (default: 180px)
 *   color        one colour for every bubble and icon, e.g. color="#fff" for a white
 *                version that sits on any background (default: violet / coral)
 *   autoplay     advance on a timer instead of on scroll, looping forever. Use this
 *                inside an iframe sized to its content, where the window never
 *                scrolls. Drops the tall sticky scroll track, so the element is only
 *                as tall as the icon. Pauses while offscreen or the tab is hidden;
 *                holds still on the first message under prefers-reduced-motion.
 *   hold         autoplay only: ms each message rests between steps (default: 1300)
 *
 * Events:
 *   "convo-step"  detail: { index, icon, theme }  — fires when a new message appears
 *
 * Styling hooks: --convo-violet, --convo-coral
 * Where bubbles overlap mid-transition the front one knocks out the one behind it,
 * so the icon stays clean over gradients and images.
 */

export const VIOLET = '#5533EE';
export const CORAL = '#FF4825';
export const STROKE = 2.5;

/* ---- Bubble geometry (exact from Figma) ---- */
export const BUBBLE_TOP = {
  body: 'M56.1071 1.25H12.2214C6.16208 1.25 1.25 6.53074 1.25 13.0449V33.6859C1.25 40.2 6.16208 45.4808 12.2214 45.4808H56.1071C62.1665 45.4808 67.0786 40.2 67.0786 33.6859V13.0449C67.0786 6.53074 62.1665 1.25 56.1071 1.25Z',
  tail: 'M17.7071 45.4808L12.2214 60.2244L28.6786 45.4808',
  center: [34.1643, 23.0],
  origin: [12.2214, 60.2244], // tail tip — bubble pops from here
};
export const BUBBLE_BOTTOM = {
  body: 'M86.2786 57.2756H42.3929C36.3335 57.2756 31.4214 62.5564 31.4214 69.0705V89.7115C31.4214 96.2257 36.3335 101.506 42.3929 101.506H86.2786C92.3379 101.506 97.25 96.2257 97.25 89.7115V69.0705C97.25 62.5564 92.3379 57.2756 86.2786 57.2756Z',
  tail: 'M80.7928 101.506L86.2786 116.25L69.8214 101.506',
  center: [64.3357, 79.1],
  origin: [86.2786, 116.25],
};

/* ---- Theme icons --------------------------------------------------------
 * Drawn in a local box centred on (0,0), roughly ±16 wide × ±10 tall, with
 * the same 2.5 round stroke as the Figma file. `c` is the icon colour.
 * ----------------------------------------------------------------------- */
const dot = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="none"/>`;

export const ICONS = {
  // Originals from the Figma frame (re-centred)
  trend: (c) =>
    `<path d="M-16.457 3.314L0 -7.006L16.457 6.263"/>` +
    dot(-16.457, 3.314, 3.43, c) + dot(0, -7.006, 3.43, c) + dot(16.457, 6.263, 3.43, c),
  lines: () => `<path d="M-19.2 -6.63H19.2M-19.2 6.63H8.23"/>`,

  // Information networks
  network: (c) =>
    `<path d="M-15 4L-3 -7L6 7L16 -3M-3 -7L16 -3M-15 4L6 7"/>` +
    dot(-15, 4, 3.2, c) + dot(-3, -7, 3.2, c) + dot(6, 7, 3.2, c) + dot(16, -3, 3.2, c),
  // Public discourse
  quote: (c) =>
    // Two opening quotes (“), each a single filled shape: the tail grows out of
    // the dot's left edge tangentially, so there is no seam. Centred on (0,0).
    [-5.3, 4.7].map((x) =>
      `<path transform="translate(${x} 3.75)" fill="${c}" stroke="none" d="` +
      `M-4 0C-4 -6 -1 -10 3.5 -11.5C5 -11 5 -10 3.5 -9.5C1 -8.5 0 -6.5 0 -4A4 4 0 1 1 -4 0Z"/>`
    ).join(''),
  // Democracy / voting
  ballot: () =>
    `<rect x="-13" y="-1" width="26" height="11" rx="2.5"/>` +
    `<path d="M-6.5 -1V-10H6.5V-1"/><path d="M-3 -5.4L-0.7 -3.2L3.2 -7.4"/>`,
  // Democratic institutions
  capitol: () =>
    `<path d="M-14 -4L0 -10.5L14 -4Z"/><path d="M-9 0V6M-3 0V6M3 0V6M9 0V6"/><path d="M-15 10H15"/>`,
  // Data & dashboards
  bars: () =>
    `<rect x="-15" y="2" width="5.5" height="8" rx="1.2"/>` +
    `<rect x="-6.5" y="-4" width="5.5" height="14" rx="1.2"/>` +
    `<rect x="2" y="-1" width="5.5" height="11" rx="1.2"/>` +
    `<rect x="10.5" y="-10" width="5.5" height="20" rx="1.2"/>`,
  // Shared data repository
  database: () =>
    `<ellipse cx="0" cy="-6.5" rx="10" ry="3.5"/>` +
    `<path d="M-10 -6.5V6.5C-10 8.43 -5.52 10 0 10C5.52 10 10 8.43 10 6.5V-6.5"/>` +
    `<path d="M-10 0C-10 1.93 -5.52 3.5 0 3.5C5.52 3.5 10 1.93 10 0"/>`,
  // Misinformation
  warning: (c) =>
    `<path d="M0 -10L11.5 9.5H-11.5Z"/><path d="M0 -3.2V2.6"/>` + dot(0, 6.2, 1.55, c),
  // Fact-checking / research
  factcheck: () =>
    `<circle cx="-3" cy="-1.5" r="8"/><path d="M2.8 4.3L9.5 10.5"/><path d="M-6.8 -1.6L-4 1.1L0.8 -4.4"/>`,
  // AI as information intermediary
  sparkle: () =>
    `<path d="M-5 -10Q-4 -1 6 0Q-4 1 -5 10Q-6 1 -16 0Q-6 -1 -5 -10Z"/>` +
    `<path d="M11 -10Q11.4 -6.4 15 -6Q11.4 -5.6 11 -2Q10.6 -5.6 7 -6Q10.6 -6.4 11 -10Z"/>`,
  // Global information ecosystem
  globe: () =>
    `<circle cx="0" cy="0" r="9.5"/><ellipse cx="0" cy="0" rx="4.2" ry="9.5"/><path d="M-9.5 0H9.5"/>`,
  // News media
  news: () =>
    `<path d="M10 -3.5H14V7A3 3 0 0 1 11 10H-11A3 3 0 0 1 -14 7V-10H10V7A3 3 0 0 0 11 10"/>` +
    `<path d="M-10 -5.5H5.5M-10 -0.5H-2M-10 4.5H-2"/><rect x="1.5" y="-0.5" width="4" height="5" rx="0.6"/>`,
  // Broadcast / media signal
  broadcast: (c) =>
    dot(0, 0, 2.6, c) +
    `<path d="M-5.5 -5Q-9.5 0 -5.5 5M5.5 -5Q9.5 0 5.5 5M-11 -9Q-17.5 0 -11 9M11 -9Q17.5 0 11 9"/>`,
  // Polarization
  diverge: () =>
    `<path d="M0 10V2L-10 -7M0 2L10 -7"/><path d="M-10 -1.5V-7H-4.5M10 -1.5V-7H4.5"/>`,
  // Common ground
  common: () => `<circle cx="-5.5" cy="0" r="8"/><circle cx="5.5" cy="0" r="8"/>`,
  // Platforms
  platform: () =>
    `<rect x="-14" y="-9.5" width="28" height="19" rx="3.5"/><path d="M-3 -4.5L5 0L-3 4.5Z"/>`,
  // Engagement / algorithms
  heart: () =>
    `<path d="M0 8.5C-12.5 0.5 -11 -9 -5 -9C-2.5 -9 -0.8 -7.2 0 -5C0.8 -7.2 2.5 -9 5 -9C11 -9 12.5 0.5 0 8.5Z"/>`,
  // Law & policy
  scales: (c) =>
    `<path d="M0 -8V9.5M-6 9.5H6M-12 -5.5H12"/>` +
    `<path d="M-12 -5.5L-15.5 2.5H-8.5ZM12 -5.5L8.5 2.5H15.5Z"/>` + dot(0, -9, 1.6, c),
  // Trust
  shield: () =>
    `<path d="M0 -10L9 -6.5V0C9 5.5 5 8.6 0 10C-5 8.6 -9 5.5 -9 0V-6.5Z"/><path d="M-4 0L-1 3L4.5 -3"/>`,

  // Political advertising / campaigns
  megaphone: () =>
    `<path d="M-13 -4H-6L8 -10V10L-6 4H-13Z"/><path d="M-9.5 4L-7.5 10"/><path d="M12 -4Q14.5 0 12 4"/>`,
  // Microtargeting
  target: (c) => `<circle cx="0" cy="0" r="9.5"/><circle cx="0" cy="0" r="5"/>` + dot(0, 0, 1.8, c),
  // Elections
  calendar: () =>
    `<rect x="-10" y="-7.5" width="20" height="17.5" rx="2.5"/><path d="M-10 -2.5H10M-5 -10.5V-5.5M5 -10.5V-5.5"/>` +
    `<path d="M-4 3.5L-1 6.5L4.5 0.5"/>`,
  // Public opinion / results
  pie: (c) =>
    `<circle cx="0" cy="0" r="9.5"/><path d="M0 0V-9.5A9.5 9.5 0 0 1 9.5 0Z" fill="${c}"/>`,
  // Social media
  hashtag: () => `<path d="M-3.5 -10L-6.5 10M5 -10L2 10M-11 -3.8H10.5M-12 3.8H9.5"/>`,
  // Virality / sharing
  share: (c) =>
    `<path d="M-9 0L8 -7M-9 0L8 7"/>` + dot(-9, 0, 3.4, c) + dot(8, -7, 3.4, c) + dot(8, 7, 3.4, c),
  // Content moderation / filtering
  funnel: () => `<path d="M-13 -9H13L3 2V9.5L-3 6.5V2Z"/>`,
  // Ranked feeds / algorithms
  feed: () =>
    `<rect x="-15" y="-10" width="20" height="8" rx="2"/><rect x="-15" y="2" width="20" height="8" rx="2"/>` +
    `<path d="M11 -9V9M7.5 5.5L11 9L14.5 5.5"/>`,
  // Computational methods
  code: () => `<path d="M-7 -8L-15 0L-7 8M7 -8L15 0L7 8M3 -10L-3 10"/>`,
  // Behavioral experiments
  flask: () =>
    `<path d="M-5 -10H5M-2.5 -10V-3L-10 8A1.4 1.4 0 0 0 -8.8 10H8.8A1.4 1.4 0 0 0 10 8L2.5 -3V-10"/><path d="M-6 3.5H6"/>`,
  // Cloud computing
  cloud: () => `<path d="M-8.5 8H9A5.8 5.8 0 0 0 9.4 -3.6A8 8 0 0 0 -5 -4.8A6.5 6.5 0 0 0 -8.5 8Z"/>`,
  // AI infrastructure
  chip: () =>
    `<rect x="-7" y="-7" width="14" height="14" rx="2"/><rect x="-2.8" y="-2.8" width="5.6" height="5.6" rx="0.8"/>` +
    `<path d="M-3 -7V-10M3 -7V-10M-3 7V10M3 7V10M-7 -3H-10M-7 3H-10M7 -3H10M7 3H10"/>`,
  // Privacy
  lock: (c) =>
    `<rect x="-8" y="-2" width="16" height="12" rx="2.5"/><path d="M-5 -2V-5.5A5 5 0 0 1 5 -5.5V-2"/>` + dot(0, 4, 1.7, c),
  // Law / courts
  gavel: () =>
    `<rect x="-10" y="-6" width="14" height="6" rx="1.5" transform="rotate(-45 -3 -3)"/>` +
    `<path d="M-0.9 -0.9L9 9M-14 10H0"/>`,
  // Audiences
  users: () =>
    `<circle cx="-5" cy="-4.5" r="3.8"/><path d="M-12.5 9.5A7.5 7.5 0 0 1 2.5 9.5"/>` +
    `<circle cx="7" cy="-3.5" r="3"/><path d="M5 3.3C9.5 2.6 13.5 5 13.5 9.5"/>`,
  // Attention
  eye: (c) => `<path d="M-14 0C-8 -9 8 -9 14 0C8 9 -8 9 -14 0Z"/><circle cx="0" cy="0" r="3.6"/>` + dot(0, 0, 1.2, c),
  // Doctoral & postdoctoral cohort
  gradcap: () =>
    `<path d="M-14 -3L0 -9L14 -3L0 3Z"/><path d="M-8 0V5.5C-8 8 -4 10 0 10C4 10 8 8 8 5.5V0"/><path d="M14 -3V5"/>`,
  // Scholarship / publications
  book: () =>
    `<path d="M0 -5C-3 -8 -8 -8.5 -14 -7.5V8C-8 7 -3 7.5 0 10C3 7.5 8 7 14 8V-7.5C8 -8.5 3 -8 0 -5ZM0 -5V10"/>`,
  // Convenings / conference
  microphone: () =>
    `<rect x="-4" y="-10" width="8" height="13" rx="4"/><path d="M-8 -1A8 8 0 0 0 8 -1M0 7V10M-4 10H4"/>`,
  // Grants / new ideas
  lightbulb: () =>
    `<path d="M-3.5 5.5V3C-6.8 1 -7.5 -1.5 -7.5 -3A7.5 7.5 0 0 1 7.5 -3C7.5 -1.5 6.8 1 3.5 3V5.5Z"/><path d="M-2.5 9H2.5"/>`,
  // Local news / Philadelphia
  pin: () => `<path d="M0 10C0 10 -8 2.5 -8 -2.5A8 8 0 0 1 8 -2.5C8 2.5 0 10 0 10Z"/><circle cx="0" cy="-2.5" r="3"/>`,
  // Broadcast television
  tv: () => `<rect x="-13" y="-5.5" width="26" height="15" rx="3"/><path d="M-5 -10.5L0 -5.5L5 -10.5"/>`,
  // Free press
  pen: () =>
    `<path d="M-13 10L-6 3"/><path d="M-6 3C-4 -5 3 -9 13 -10C12 -1 7 4 -6 3Z"/><path d="M-6 3L5.5 -5"/>`,
  // Visual media
  camera: (c) =>
    `<rect x="-13" y="-6" width="26" height="16" rx="3"/><path d="M-5 -6L-3 -10H3L5 -6"/><circle cx="0" cy="2" r="4.5"/>` +
    dot(9, -2, 1.3, c),
  // Bridging divides
  bridge: () => `<path d="M-15 4H15M-12 4C-12 -6.5 12 -6.5 12 4M-6 -2V4M0 -3.5V4M6 -2V4M-12 4V10M12 4V10"/>`,
  // Public sphere / dialogue
  dialogue: () =>
    `<path d="M-14 -8H-2V0H-8L-11 3V0H-14Z"/><path d="M2 -3H14V6H11V9L8 6H2Z"/>`,
};

/* ---- Theme pairs: [top bubble icon, bottom bubble icon] ---- */
export const THEMES = [
  { id: 'original',       label: 'Information & discourse',   top: 'trend',    bottom: 'lines' },
  { id: 'networks',       label: 'Information networks',      top: 'network',  bottom: 'quote' },
  { id: 'democracy',      label: 'Democracy',                 top: 'ballot',   bottom: 'capitol' },
  { id: 'data',           label: 'Data & research infrastructure', top: 'bars', bottom: 'database' },
  { id: 'misinformation', label: 'Misinformation & fact-checking', top: 'warning', bottom: 'factcheck' },
  { id: 'ai',             label: 'AI as information intermediary', top: 'sparkle', bottom: 'globe' },
  { id: 'news',           label: 'News media',                top: 'news',     bottom: 'broadcast' },
  { id: 'polarization',   label: 'Polarization & common ground', top: 'diverge', bottom: 'common' },
  { id: 'platforms',      label: 'Platforms & engagement',    top: 'platform', bottom: 'heart' },
  { id: 'policy',         label: 'Law, policy & trust',       top: 'scales',   bottom: 'shield' },
  { id: 'political-ads',  label: 'Political advertising',     top: 'megaphone', bottom: 'target' },
  { id: 'elections',      label: 'Elections & public opinion', top: 'calendar', bottom: 'pie' },
  { id: 'social-media',   label: 'Social media & virality',   top: 'hashtag',  bottom: 'share' },
  { id: 'algorithms',     label: 'Algorithms & moderation',   top: 'funnel',   bottom: 'feed' },
  { id: 'methods',        label: 'Computational social science', top: 'code', bottom: 'flask' },
  { id: 'infrastructure', label: 'Cloud & AI infrastructure', top: 'cloud',    bottom: 'chip' },
  { id: 'rights',         label: 'Privacy & rights',          top: 'lock',     bottom: 'gavel' },
  { id: 'audiences',      label: 'Audiences & attention',     top: 'users',    bottom: 'eye' },
  { id: 'scholarship',    label: 'Scholars & research',       top: 'gradcap',  bottom: 'book' },
  { id: 'convenings',     label: 'Convenings & ideas',        top: 'microphone', bottom: 'lightbulb' },
  { id: 'local-news',     label: 'Local & broadcast news',    top: 'pin',      bottom: 'tv' },
  { id: 'free-press',     label: 'Free press',                top: 'pen',      bottom: 'camera' },
  { id: 'bridging',       label: 'Bridging divides',          top: 'bridge',   bottom: 'dialogue' },
];

const strokeAttrs = (c) =>
  `stroke="${c}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;

/** Markup for one bubble (outline + tail + icon), positioned as in Figma. */
export function bubbleMarkup(which, iconId, { bubbleColor, iconColor, ids = false } = {}) {
  const b = which === 'top' ? BUBBLE_TOP : BUBBLE_BOTTOM;
  const bc = bubbleColor ?? (which === 'top' ? VIOLET : CORAL);
  const ic = iconColor ?? (which === 'top' ? CORAL : VIOLET);
  const icon = ICONS[iconId](ic);
  const id = (s) => (ids ? ` id="${s}"` : '');
  return (
    `<g${id(`bubble-${which}`)}>` +
    `<path${id(`bubble-${which}-body`)} d="${b.body}" ${strokeAttrs(bc)}/>` +
    `<path${id(`bubble-${which}-tail`)} d="${b.tail}" ${strokeAttrs(bc)}/>` +
    `<g${id(`icon-${iconId}`)} transform="translate(${b.center[0]} ${b.center[1]})" ${strokeAttrs(ic)}>${icon}</g>` +
    `</g>`
  );
}

/** Full static icon, same 99×118 frame as the Figma original. */
export function staticSVG(theme) {
  return (
    `<svg width="99" height="118" viewBox="0 0 99 118" fill="none" xmlns="http://www.w3.org/2000/svg">\n` +
    `<g id="conversation icon / ${theme.id}">\n` +
    bubbleMarkup('top', theme.top, { ids: true }) + '\n' +
    bubbleMarkup('bottom', theme.bottom, { ids: true }) + '\n' +
    `</g>\n</svg>\n`
  );
}

/* ---- Scroll-driven web component ----------------------------------------
 * The themes are unrolled into a stream of messages (each theme contributes a
 * top icon then a bottom icon). Two messages are on screen at rest. Each scroll
 * step plays one fixed-length, time-based transition, one bubble at a time:
 *   1. the older (top) message lifts away and fades out,
 *   2. the newer (bottom) message moves up into the top slot,
 *   3. a brand-new message pops in at the bottom slot.
 * Because the motion runs on time rather than being scrubbed by scroll, it
 * stays smooth with any wheel/trackpad and always comes to rest fully drawn.
 * ----------------------------------------------------------------------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const phase = (t, [a, b]) => clamp((t - a) / (b - a));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
// Gentle overshoot so the pop feels springy without wobbling.
const easeOutBack = (t, s = 1.15) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

export const DURATION = 1100;           // ms per step
export const DURATION_REDUCED = 300;    // ms crossfade when reduced motion is on
const EXIT = [0, 0.45];                 // old top message: lift + fade out
const MOVE = [0.1, 0.7];                // bottom message travels up to the top slot
const ENTER = [0.45, 0.95];             // new message pops in at the bottom slot
const EXIT_LIFT = 14;                   // icon units the leaving message rises
const ENTER_RISE = 6;                   // icon units a new bubble rises into place
const ENTER_SCALE = 0.55;               // starting scale of a popping bubble
const MOVE_DX = BUBBLE_TOP.center[0] - BUBBLE_BOTTOM.center[0];
const MOVE_DY = BUBBLE_TOP.center[1] - BUBBLE_BOTTOM.center[1];

/** Unroll theme pairs into the message stream: [{ icon, theme }, …]. */
export const messagesOf = (themes) => themes.flatMap((t) => [{ icon: t.top, theme: t }, { icon: t.bottom, theme: t }]);

/**
 * Pose of every moving part at time t ∈ [0,1] of one step (pure, shared with
 * the GIF exporter). `out` is the leaving top message, `mid` the bottom message
 * travelling up (it cross-fades from its bottom-slot look to its top-slot look
 * as it goes), `inn` the new bottom message.
 */
export function stepPose(t) {
  const e = easeInOutCubic(phase(t, EXIT));
  const m = easeInOutCubic(phase(t, MOVE));
  const p = phase(t, ENTER);
  const fade = easeInOutCubic(clamp((m - 0.2) / 0.6));
  return {
    out: { dy: -EXIT_LIFT * e, opacity: 1 - e },
    mid: {
      bottom: { dx: MOVE_DX * m, dy: MOVE_DY * m, opacity: 1 - fade },
      top: { dx: -MOVE_DX * (1 - m), dy: -MOVE_DY * (1 - m), opacity: fade },
    },
    inn: {
      scale: ENTER_SCALE + (1 - ENTER_SCALE) * easeOutBack(p),
      rise: ENTER_RISE * (1 - easeOutQuart(p)),
      opacity: easeOutCubic(clamp(p / 0.6)),
    },
  };
}

if (typeof window !== 'undefined' && !customElements.get('mediated-conversation')) {
  class MediatedConversation extends HTMLElement {
    connectedCallback() {
      const ids = (this.getAttribute('themes') || '').split(',').map((s) => s.trim()).filter(Boolean);
      this.themes = ids.length ? ids.map((id) => THEMES.find((t) => t.id === id)).filter(Boolean) : THEMES;
      this.autoplay = this.hasAttribute('autoplay');
      this.msgs = messagesOf(this.themes);
      // Autoplay loops: append the first two messages so the last step comes to
      // rest on exactly the opening frame, then jump back to step 0 unseen.
      if (this.autoplay) this.msgs.push(this.msgs[0], this.msgs[1]);
      this.steps = this.msgs.length - 2;           // step s shows messages s (top) and s+1 (bottom)
      const stepH = this.getAttribute('step-height') || '40vh';
      const size = this.getAttribute('size') || '180px';
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host { display:block; position:relative; ${this.autoplay ? '' : `height: calc(${stepH} * ${this.steps} + 100vh);`} }
          .stage { ${this.autoplay ? '' : 'position:sticky; top:0; height:100vh;'} display:flex; flex-direction:column;
                   align-items:center; justify-content:center; gap:24px; }
          svg { width:${size}; height:auto; overflow:visible; display:block; }
          [data-msg], [data-v] { will-change: transform, opacity; }
        </style>
        <div class="stage">
          <svg viewBox="0 0 99 118" role="img"
               aria-label="Conversation icon cycling through Penn MEDIATED research themes">
            <defs>
              <mask id="ko-out" maskUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="240">
                <rect x="-60" y="-60" width="220" height="240" fill="#fff"/><g class="carve-out"></g>
              </mask>
              <mask id="ko-mid" maskUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="240">
                <rect x="-60" y="-60" width="220" height="240" fill="#fff"/><g class="carve-mid"></g>
              </mask>
            </defs>
            <g class="msgs"></g>
          </svg>
          <slot></slot>
        </div>`;

      const root = this.shadowRoot.querySelector('.msgs');
      const css = getComputedStyle(this);
      const mono = this.getAttribute('color');
      const violet = mono || css.getPropertyValue('--convo-violet').trim() || VIOLET;
      const coral = mono || css.getPropertyValue('--convo-coral').trim() || CORAL;
      this.carveOut = this.shadowRoot.querySelector('.carve-out');
      this.carveMid = this.shadowRoot.querySelector('.carve-mid');
      // Each message carries both of its looks: the top slot (violet bubble,
      // coral icon) and the bottom slot (coral bubble, violet icon).
      root.innerHTML = this.msgs
        .map((m) =>
          `<g data-msg style="display:none">` +
          `<g data-v="top">${bubbleMarkup('top', m.icon, { bubbleColor: violet, iconColor: coral })}</g>` +
          `<g data-v="bottom">${bubbleMarkup('bottom', m.icon, { bubbleColor: coral, iconColor: violet })}</g>` +
          `</g>`)
        .join('');
      this.nodes = [...root.querySelectorAll('[data-msg]')].map((g) => ({
        g,
        top: g.querySelector('[data-v="top"]'),
        bottom: g.querySelector('[data-v="bottom"]'),
      }));

      this.shown = this.autoplay ? 0 : this.targetIndex();
      this.anim = null;           // { from, to, start }
      this.showOnly(this.shown);

      if (this.autoplay) {
        this.startAutoplay();
      } else {
        this.onScroll = () => this.update();
        addEventListener('scroll', this.onScroll, { passive: true });
        addEventListener('resize', this.onScroll);
      }
      // Announce the starting step once page scripts have attached listeners.
      setTimeout(() => this.announce(this.shown));
    }

    disconnectedCallback() {
      if (this.onScroll) {
        removeEventListener('scroll', this.onScroll);
        removeEventListener('resize', this.onScroll);
      }
      clearTimeout(this.timer);
      if (this.io) this.io.disconnect();
      cancelAnimationFrame(this.raf);
    }

    /** Autoplay: rest `hold` ms, play one step, repeat. Skips a step (and checks
     *  again after the next rest) while offscreen or the tab is hidden. */
    startAutoplay() {
      const hold = parseFloat(this.getAttribute('hold')) || 1300;
      this.visible = true;
      // With no root, IntersectionObserver measures against the top-level
      // viewport, so this also works inside a cross-origin iframe.
      this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; });
      this.io.observe(this);
      const rest = () => {
        this.timer = setTimeout(() => {
          if (this.reduced || !this.visible || document.hidden) { rest(); return; }
          this.advance(rest);
        }, hold);
      };
      rest();
    }

    /** Play one autoplay step forward, wrapping to step 0 at the end. */
    advance(done) {
      const from = this.shown;
      const to = from + 1 === this.steps ? 0 : from + 1;   // last step rests on the opening frame
      const start = performance.now();
      this.announce(to);
      const frame = (now) => {
        const t = clamp((now - start) / DURATION);
        this.draw(from, t);
        if (t < 1) { this.raf = requestAnimationFrame(frame); return; }
        this.shown = to;
        this.showOnly(to);
        done();
      };
      this.raf = requestAnimationFrame(frame);
    }

    /** Which step the scroll position asks for (switches at the midpoint of each step). */
    targetIndex() {
      const r = this.getBoundingClientRect();
      const travel = r.height - innerHeight;
      const p = travel > 0 ? clamp(-r.top / travel) * this.steps : 0;
      return Math.min(this.steps, Math.round(p));
    }

    update() {
      if (this.anim) return;                      // finishing transition will re-check
      const target = this.targetIndex();
      if (target === this.shown) return;
      // Move one message at a time, scrolling back plays a step in reverse.
      const dir = Math.sign(target - this.shown);
      this.anim = { from: this.shown, to: this.shown + dir, start: performance.now() };
      this.announce(this.anim.to);
      const tick = (now) => {
        const { from, to, start } = this.anim;
        const t = clamp((now - start) / (this.reduced ? DURATION_REDUCED : DURATION));
        this.draw(Math.min(from, to), dir > 0 ? t : 1 - t);
        if (t < 1) { this.raf = requestAnimationFrame(tick); return; }
        this.shown = to;
        this.anim = null;
        this.showOnly(this.shown);
        this.update();                            // catch up if the user kept scrolling
      };
      this.raf = requestAnimationFrame(tick);
    }

    announce(step) {
      const m = this.msgs[step + 1];
      this.dispatchEvent(new CustomEvent('convo-step', { detail: { index: step, icon: m.icon, theme: m.theme } }));
    }

    /** Apply opacity/transform to one element. */
    put(el, opacity, transform) {
      el.setAttribute('opacity', opacity.toFixed(3));
      if (transform) el.setAttribute('transform', transform); else el.removeAttribute('transform');
    }

    /** Hide every message, then show messages `s` (top) and `s+1` (bottom) at rest. */
    showOnly(s) {
      this.nodes.forEach(({ g, top, bottom }, j) => {
        g.style.display = j === s || j === s + 1 ? '' : 'none';
        g.removeAttribute('transform');
        g.removeAttribute('mask');
        this.put(top, j === s ? 1 : 0);
        this.put(bottom, j === s + 1 ? 1 : 0);
      });
    }

    /** One frame of step `s` at time t ∈ [0,1]. */
    draw(s, t) {
      const [out, mid, inn] = [this.nodes[s], this.nodes[s + 1], this.nodes[s + 2]];
      this.nodes.forEach(({ g }) => { g.style.display = 'none'; });
      for (const n of [out, mid, inn]) { n.g.style.display = ''; n.g.removeAttribute('transform'); n.g.removeAttribute('mask'); }

      if (this.reduced) {                         // plain crossfade, no movement
        const k = easeInOutCubic(t);
        this.put(out.top, 1 - k); this.put(out.bottom, 0);
        this.put(mid.top, 0); this.put(mid.bottom, 1);
        this.put(inn.top, 0); this.put(inn.bottom, k);
        return;
      }

      const p = stepPose(t);
      // 1. leaving message lifts and fades
      this.put(out.top, p.out.opacity, `translate(0 ${p.out.dy.toFixed(3)})`);
      this.put(out.bottom, 0);
      // 2. middle message travels up, swapping its bottom look for its top look
      this.put(mid.bottom, p.mid.bottom.opacity, `translate(${p.mid.bottom.dx.toFixed(3)} ${p.mid.bottom.dy.toFixed(3)})`);
      this.put(mid.top, p.mid.top.opacity, `translate(${p.mid.top.dx.toFixed(3)} ${p.mid.top.dy.toFixed(3)})`);
      // 3. new message pops in from its tail tip at the bottom slot
      const [ox, oy] = BUBBLE_BOTTOM.origin;
      const innT = `translate(0 ${p.inn.rise.toFixed(3)}) translate(${ox} ${oy}) scale(${p.inn.scale.toFixed(4)}) translate(${-ox} ${-oy})`;
      this.put(inn.top, 0);
      this.put(inn.bottom, p.inn.opacity, innT);

      // Knock-out: a bubble in front (nearly opaque) hides the outline of one behind it.
      const midLook = p.mid.top.opacity >= 0.5
        ? ['top', p.mid.top, `translate(${p.mid.top.dx.toFixed(3)} ${p.mid.top.dy.toFixed(3)})`]
        : ['bottom', p.mid.bottom, `translate(${p.mid.bottom.dx.toFixed(3)} ${p.mid.bottom.dy.toFixed(3)})`];
      const shape = (which, tf) => {
        const g = which === 'top' ? BUBBLE_TOP : BUBBLE_BOTTOM;
        return `<g transform="${tf}" fill="#000" stroke="#000" stroke-width="5" stroke-linejoin="round"><path d="${g.body}"/><path d="${g.tail}"/></g>`;
      };
      const front = (o) => o >= 0.9;
      const midShape = front(midLook[1].opacity) ? shape(midLook[0], midLook[2]) : '';
      const innShape = front(p.inn.opacity) ? shape('bottom', innT) : '';
      this.carveOut.innerHTML = midShape + innShape;
      this.carveMid.innerHTML = innShape;
      if (this.carveOut.innerHTML) out.g.setAttribute('mask', 'url(#ko-out)');
      if (this.carveMid.innerHTML) mid.g.setAttribute('mask', 'url(#ko-mid)');
    }
  }
  customElements.define('mediated-conversation', MediatedConversation);
}
