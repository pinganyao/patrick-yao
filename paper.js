// Track heading boundaries so long sections remain active between headings.
(function () {
    const entries = Array.from(document.querySelectorAll('.paper-toc a[href^="#"]'))
        .map(link => ({ link, heading: document.getElementById(link.hash.slice(1)) }))
        .filter(entry => entry.heading);
    if (!entries.length) return;

    let scheduled = false;
    function update() {
        scheduled = false;
        const offset = parseFloat(getComputedStyle(entries[0].heading).scrollMarginTop) || 120;
        let current = entries[0];
        for (const entry of entries) {
            if (entry.heading.getBoundingClientRect().top <= offset + 2) current = entry;
            else break;
        }
        for (const entry of entries) {
            if (entry === current) entry.link.setAttribute('aria-current', 'location');
            else entry.link.removeAttribute('aria-current');
        }
    }
    function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
    // Lazy-loaded figures and font changes can shift section boundaries.
    if ('ResizeObserver' in window) {
        new ResizeObserver(schedule).observe(document.querySelector('.paper-content'));
    }
    update();
})();
