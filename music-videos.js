(function () {
  var grid = document.getElementById('music-videos-grid');
  var lightbox = document.getElementById('works-video-lightbox');
  var player = document.getElementById('works-video-lightbox-player');
  if (!grid || !lightbox || !player) return;

  var closeBtn = lightbox.querySelector('.works-video-lightbox-close');
  var MAX_ATTEMPTS = 3;
  var RETRY_DELAYS_MS = [0, 800, 2000];

  function openVideo(videoId, title) {
    player.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    player.title = title || 'YouTube video player';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('works-video-lightbox--open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeVideo() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('works-video-lightbox--open');
    document.body.style.overflow = '';
    player.src = '';
  }

  function renderVideos(videos) {
    grid.innerHTML = '';
    grid.removeAttribute('data-loading');

    videos.forEach(function (video) {
      var article = document.createElement('article');
      article.className = 'work-video-item';

      var label = 'Play ' + video.fullTitle;
      article.innerHTML =
        '<button type="button" class="work-video-thumb" data-video-id="' + video.id + '" data-video-title="' + escapeAttr(video.fullTitle) + '" aria-label="' + escapeAttr(label) + '">' +
          '<img src="https://i.ytimg.com/vi/' + video.id + '/mqdefault.jpg" alt="" loading="lazy">' +
        '</button>' +
        '<h3 class="work-video-title">' + escapeHtml(video.displayTitle) + '</h3>' +
        '<p class="work-video-year">' + video.year + '</p>';

      grid.appendChild(article);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/'/g, '&#39;');
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function fetchJson(url) {
    return fetch(url).then(function (response) {
      if (!response.ok) throw new Error('fetch failed');
      return response.json();
    });
  }

  function loadVideosFromApi(attempt) {
    return wait(RETRY_DELAYS_MS[attempt] || 0).then(function () {
      return fetchJson('/api/youtube-videos');
    }).then(function (data) {
      if (!data.videos || !data.videos.length) throw new Error('no videos');
      return data.videos;
    }).catch(function (error) {
      if (attempt + 1 < MAX_ATTEMPTS) {
        return loadVideosFromApi(attempt + 1);
      }
      throw error;
    });
  }

  function loadVideos() {
    return loadVideosFromApi(0).catch(function () {
      return fetchJson('/data/youtube-videos.json').then(function (data) {
        if (!data.videos || !data.videos.length) throw new Error('no cached videos');
        return data.videos;
      });
    });
  }

  function showError() {
    grid.innerHTML = '<p class="music-videos-error">Could not load videos. <a href="https://www.youtube.com/@patrickyao/videos" target="_blank" rel="noopener">View on YouTube</a>.</p>';
    grid.removeAttribute('data-loading');
  }

  grid.addEventListener('click', function (event) {
    var button = event.target.closest('.work-video-thumb');
    if (!button) return;
    openVideo(button.getAttribute('data-video-id'), button.getAttribute('data-video-title'));
  });

  closeBtn.addEventListener('click', closeVideo);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeVideo();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('works-video-lightbox--open')) {
      closeVideo();
    }
  });

  loadVideos()
    .then(renderVideos)
    .catch(showError);
})();
