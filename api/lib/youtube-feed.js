const fs = require('fs');
const path = require('path');

const CHANNEL_ID = 'UCfAqGu3PxJR3BmomdbG6bxQ';
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2);
const MAX_VIDEOS = 18;
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CACHE_PATH = path.join(process.cwd(), 'data', 'youtube-videos.json');
const FETCH_HEADERS = {
  'User-Agent': 'patrick-yao-website/1.0',
  Accept: 'application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
};

function decodeXml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function displayTitle(fullTitle) {
  return decodeXml(fullTitle).replace(/\s*\|\s*Patrick Yao\s*$/i, '').trim();
}

function parseRss(xml) {
  const videos = [];
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryPattern.exec(xml)) !== null && videos.length < MAX_VIDEOS) {
    const block = match[1];
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>([^<]+)<\/title>/);
    const publishedMatch = block.match(/<published>([^<]+)<\/published>/);
    if (!idMatch || !titleMatch || !publishedMatch) continue;

    const fullTitle = decodeXml(titleMatch[1]);
    videos.push({
      id: idMatch[1],
      fullTitle,
      displayTitle: displayTitle(fullTitle),
      year: new Date(publishedMatch[1]).getFullYear(),
    });
  }

  return videos;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(fetchFn, attempts = 4, baseDelayMs = 400) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await sleep(baseDelayMs * (attempt + 1));
      }
    }
  }

  throw lastError;
}

async function fetchFromRss() {
  const response = await fetch(RSS_URL, { headers: FETCH_HEADERS });
  if (!response.ok) {
    throw new Error(`RSS fetch failed (${response.status})`);
  }

  const xml = await response.text();
  if (!xml.includes('<feed') || !xml.includes('<entry>')) {
    throw new Error('RSS response was not a valid feed');
  }

  const videos = parseRss(xml);
  if (!videos.length) {
    throw new Error('RSS feed contained no videos');
  }

  return videos;
}

async function fetchFromApi(apiKey) {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', UPLOADS_PLAYLIST);
  url.searchParams.set('maxResults', String(MAX_VIDEOS));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || !data.items?.length) {
    throw new Error(data.error?.message || 'YouTube API request failed');
  }

  const videos = data.items
    .filter((item) => item.snippet?.resourceId?.videoId)
    .map((item) => {
      const fullTitle = item.snippet.title;
      return {
        id: item.snippet.resourceId.videoId,
        fullTitle,
        displayTitle: displayTitle(fullTitle),
        year: new Date(item.snippet.publishedAt).getFullYear(),
      };
    });

  if (!videos.length) {
    throw new Error('YouTube API returned no videos');
  }

  return videos;
}

function readCache() {
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data.videos?.length) {
      throw new Error('Cache file has no videos');
    }
    return data.videos;
  } catch (error) {
    throw new Error('Failed to read cached videos');
  }
}

async function fetchVideosLive(apiKey) {
  const errors = [];

  if (apiKey) {
    try {
      const videos = await fetchWithRetry(() => fetchFromApi(apiKey), 2, 300);
      return { videos, source: 'api' };
    } catch (error) {
      errors.push(error);
    }
  }

  try {
    const videos = await fetchWithRetry(() => fetchFromRss(), 5, 500);
    return { videos, source: 'rss' };
  } catch (error) {
    errors.push(error);
  }

  const videos = readCache();
  return { videos, source: 'cache' };
}

module.exports = {
  CHANNEL_ID,
  MAX_VIDEOS,
  CACHE_PATH,
  fetchVideosLive,
  fetchFromRss,
  readCache,
  parseRss,
};
