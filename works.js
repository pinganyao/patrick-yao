(function() {
    var overlay = document.getElementById('project-modal');
    if (!overlay) return;

    var closeBtn = overlay.querySelector('.project-modal-close');
    var logoEl = overlay.querySelector('.project-modal-logo');
    var titleEl = overlay.querySelector('.project-modal-title');
    var descEl = overlay.querySelector('.project-modal-desc');
    var visitEl = overlay.querySelector('.project-modal-visit');
    var cards = document.querySelectorAll('.project-card');
    var lastFocusedCard = null;

    function openModal(card) {
        var title = card.getAttribute('data-title');
        var url = card.getAttribute('href');
        var logo = card.getAttribute('data-logo');
        var desc = card.getAttribute('data-desc');
        if (!title || !url) return;

        logoEl.src = logo || '';
        logoEl.alt = title;
        logoEl.classList.toggle('project-logo-adaptive', !!card.querySelector('.project-logo-adaptive'));
        logoEl.classList.toggle('project-logo-invert-light', !!card.querySelector('.project-logo-invert-light'));
        titleEl.textContent = title;
        var domain = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        descEl.textContent = desc || '';
        visitEl.href = url;
        visitEl.textContent = domain + ' ↗';

        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('project-modal-overlay--open');
        document.body.style.overflow = 'hidden';
        lastFocusedCard = card;
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        overlay.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('project-modal-overlay--open');
        document.body.style.overflow = '';
        if (lastFocusedCard) {
            lastFocusedCard.focus();
            lastFocusedCard = null;
        }
    }

    cards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
                return;
            }
            e.preventDefault();
            openModal(card);
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('project-modal-overlay--open')) {
            closeModal();
        }
    });
})();
