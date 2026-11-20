// Pulls the 6 newest @penn_mediated posts via the Instagram API and writes
// data/instagram.json + local copies of the thumbnails (Instagram's CDN URLs
// expire within days, so we never hotlink them).
// Needs INSTAGRAM_ACCESS_TOKEN (long-lived token, Instagram API with Instagram Login).
import { writeFile, readdir, unlink, mkdir } from 'node:fs/promises';

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
if (!TOKEN) { console.log('INSTAGRAM_ACCESS_TOKEN not set — leaving data unchanged.'); process.exit(0); }

const COUNT = 6;
const IMG_DIR = 'assets/instagram';
const api = 'https://graph.instagram.com';

// Extend the token's 60-day life each run (fails harmlessly if <24h old).
try { await fetch(`${api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`); } catch {}

const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const res = await fetch(`${api}/me/media?fields=${fields}&limit=12&access_token=${TOKEN}`);
if (!res.ok) { console.error(await res.text()); process.exit(1); }
const { data = [] } = await res.json();

await mkdir(IMG_DIR, { recursive: true });
const posts = [];
for (const m of data.sort((a, b) => b.timestamp.localeCompare(a.timestamp))) {
  if (posts.length === COUNT) break;
  const src = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
  if (!src) continue;
  const img = await fetch(src);
  if (!img.ok) continue;
  const file = `${m.id}.jpg`;
  await writeFile(`${IMG_DIR}/${file}`, Buffer.from(await img.arrayBuffer()));
  posts.push({
    id: m.id,
    permalink: m.permalink,
    image: `${IMG_DIR}/${file}`,
    caption: (m.caption || '').replace(/\s+/g, ' ').trim().slice(0, 160),
    type: m.media_type,
    timestamp: m.timestamp,
  });
}
if (!posts.length) { console.error('No posts returned; keeping existing data.'); process.exit(1); }

// Drop images for posts that fell out of the grid.
const keep = new Set(posts.map(p => p.image.split('/').pop()).concat('.gitkeep'));
for (const f of await readdir(IMG_DIR)) if (!keep.has(f)) await unlink(`${IMG_DIR}/${f}`);

// `updated` only changes when the posts do, so unchanged runs commit nothing.
const prev = JSON.stringify(posts.map(p => p.id));
let updated = new Date().toISOString();
try {
  const old = JSON.parse(await (await import('node:fs/promises')).readFile('data/instagram.json', 'utf8'));
  if (JSON.stringify(old.posts.map(p => p.id)) === prev) updated = old.updated;
} catch {}
await writeFile('data/instagram.json', JSON.stringify({ updated, posts }, null, 2) + '\n');
console.log(`Wrote ${posts.length} posts.`);
