const { fetchVideosLive } = require('./lib/youtube-feed');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const { videos, source } = await fetchVideosLive(apiKey);
    res.status(200).json({ videos, source });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};
