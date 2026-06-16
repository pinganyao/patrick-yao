const CHANNEL_ID = 'UCfAqGu3PxJR3BmomdbG6bxQ';
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2);
const MAX_VIDEOS = 18;
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

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

async function fetchFromRss() {
  const response = await fetch(RSS_URL, {
    headers: { 'User-Agent': 'patrick-yao-website/1.0' },
  });
  if (!response.ok) throw new Error('RSS fetch failed');
  return parseRss(await response.text());
}

async function fetchFromApi(apiKey) {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', UPLOADS_PLAYLIST);
  url.searchParams.set('maxResults', String(MAX_VIDEOS));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || !data.items) {
    throw new Error(data.error?.message || 'YouTube API request failed');
  }

  return data.items
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
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const videos = apiKey ? await fetchFromApi(apiKey) : await fetchFromRss();
    res.status(200).json({ videos, source: apiKey ? 'api' : 'rss' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};
