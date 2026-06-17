/**
 * Caches YouTube videos for the music page. Run: npm run cache-youtube
 * Used at build time so the site still has videos when live RSS fetches fail.
 */

const fs = require('fs');
const path = require('path');
const { fetchVideosLive, CACHE_PATH } = require('../api/lib/youtube-feed');

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { videos, source } = await fetchVideosLive(apiKey);

  const output = {
    videos,
    source,
    cachedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`Cached ${videos.length} videos (${source}) to data/youtube-videos.json`);
}

main().catch((error) => {
  console.error('Failed to cache YouTube videos:', error.message);
  process.exit(1);
});
